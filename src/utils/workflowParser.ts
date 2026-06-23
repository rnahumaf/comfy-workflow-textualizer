export interface ComfyInput {
  name: string;
  type: string;
  link: number | null;
}

export interface ComfyOutput {
  name: string;
  type: string;
  links: number[] | null;
  slot_index?: number;
}

export interface ComfyNode {
  id: number;
  type: string;
  title?: string;
  inputs?: ComfyInput[];
  outputs?: ComfyOutput[];
  widgets_values?: any[];
}

export interface ComfyWorkflow {
  nodes: ComfyNode[];
  links?: Array<[number, number, number, number, number, string]> | null;
}

export interface Edge {
  id: number;
  fromNodeId: number;
  fromSlotName: string;
  toNodeId: number;
  toSlotName: string;
  type: string;
}

export interface ParserOptions {
  includeNodeIds: boolean;
  preferTitles: boolean;
  fullChains: boolean;
  ignoreUnconnected: boolean;
}

export function parseWorkflow(workflow: ComfyWorkflow, options: ParserOptions): string {
  if (!workflow || !workflow.nodes) {
    return 'Workflow inválido ou vazio.';
  }

  // 1. Criar mapa de nós por ID
  const nodeMap = new Map<number, ComfyNode>();
  workflow.nodes.forEach(node => {
    nodeMap.set(node.id, node);
  });

  // Helper para obter o nome legível do nó
  const getNodeName = (nodeId: number): string => {
    const node = nodeMap.get(nodeId);
    if (!node) return `Nó #${nodeId}`;
    
    let displayName = options.preferTitles && node.title ? node.title : node.type;
    // Se o tipo ou título tiver espaços extras ou aspas, limpamos
    displayName = displayName.trim();
    
    return options.includeNodeIds ? `${displayName} (#${node.id})` : displayName;
  };

  // 2. Extrair todas as conexões (edges) a partir da lista de links do ComfyUI
  // O formato dos links é: [link_id, origin_node_id, origin_slot_index, target_node_id, target_slot_index, type]
  const edges: Edge[] = [];
  const connectedNodeIds = new Set<number>();

  if (workflow.links && Array.isArray(workflow.links)) {
    workflow.links.forEach(link => {
      if (!link || link.length < 6) return;
      const [linkId, fromNodeId, fromSlotIdx, toNodeId, toSlotIdx, linkType] = link;
      
      const fromNode = nodeMap.get(fromNodeId);
      const toNode = nodeMap.get(toNodeId);
      
      if (!fromNode || !toNode) return;

      connectedNodeIds.add(fromNodeId);
      connectedNodeIds.add(toNodeId);

      // Resolver nome do slot de saída (origem)
      let fromSlotName = linkType;
      if (fromNode.outputs) {
        // Tentar por slot_index
        const outputBySlot = fromNode.outputs.find(o => o.slot_index === fromSlotIdx);
        if (outputBySlot) {
          fromSlotName = outputBySlot.name;
        } else {
          // Tentar por linkId contido no array links
          const outputByLink = fromNode.outputs.find(o => o.links && o.links.includes(linkId));
          if (outputByLink) {
            fromSlotName = outputByLink.name;
          } else if (fromNode.outputs[fromSlotIdx]) {
            fromSlotName = fromNode.outputs[fromSlotIdx].name;
          }
        }
      }

      // Resolver nome do slot de entrada (destino)
      let toSlotName = linkType;
      if (toNode.inputs) {
        // Tentar por índice do array
        if (toNode.inputs[toSlotIdx]) {
          toSlotName = toNode.inputs[toSlotIdx].name;
        } else {
          // Tentar encontrar o input que aponta para este link
          const inputByLink = toNode.inputs.find(i => i.link === linkId);
          if (inputByLink) {
            toSlotName = inputByLink.name;
          }
        }
      }

      edges.push({
        id: linkId,
        fromNodeId,
        fromSlotName,
        toNodeId,
        toSlotName,
        type: linkType
      });
    });
  }

  // Se não houver conexões, listar apenas os nós
  if (edges.length === 0) {
    if (options.ignoreUnconnected) {
      return 'Nenhuma conexão ativa encontrada no workflow.';
    }
    return workflow.nodes.map(n => getNodeName(n.id)).join('\n');
  }

  // 3. Organizar conexões para busca rápida de adjacências
  const outgoing: Record<number, Edge[]> = {};
  const incoming: Record<number, Edge[]> = {};

  edges.forEach(edge => {
    if (!outgoing[edge.fromNodeId]) outgoing[edge.fromNodeId] = [];
    outgoing[edge.fromNodeId].push(edge);

    if (!incoming[edge.toNodeId]) incoming[edge.toNodeId] = [];
    incoming[edge.toNodeId].push(edge);
  });

  // 4. Algoritmo de Geração de Cadeias (Chains)
  const uncoveredEdges = new Set<number>(edges.map(e => e.id));
  const edgeMap = new Map<number, Edge>(edges.map(e => [e.id, e]));
  const chains: string[] = [];

  while (uncoveredEdges.size > 0) {
    // Pegar o primeiro link descoberto
    const startEdgeId = uncoveredEdges.values().next().value;
    if (startEdgeId === undefined) break;

    const startEdge = edgeMap.get(startEdgeId)!;
    
    // Rastrear para trás (upstream) para encontrar o nó de início ideal
    let pathStartNode = startEdge.fromNodeId;
    const visitedBackward = new Set<number>();
    visitedBackward.add(pathStartNode);

    while (true) {
      const inc = incoming[pathStartNode] || [];
      // Priorizar links de entrada não cobertos para voltar, senão qualquer link (se fullChains for ativo)
      const nextEdge = inc.find(e => uncoveredEdges.has(e.id) && !visitedBackward.has(e.fromNodeId))
                    || (options.fullChains ? inc.find(e => !visitedBackward.has(e.fromNodeId)) : undefined);
      
      if (nextEdge) {
        pathStartNode = nextEdge.fromNodeId;
        visitedBackward.add(pathStartNode);
      } else {
        break;
      }
    }

    // Agora caminhar para frente (downstream) a partir de pathStartNode
    interface ChainElement {
      nodeId: number;
      fromSlot?: string;
      toSlot?: string;
    }
    
    const elements: ChainElement[] = [{ nodeId: pathStartNode }];
    let currNodeId = pathStartNode;
    const visitedForward = new Set<number>();
    visitedForward.add(currNodeId);

    while (true) {
      const out = outgoing[currNodeId] || [];
      // Priorizar outgoing edges que não estão cobertas
      let nextEdge = out.find(e => uncoveredEdges.has(e.id) && !visitedForward.has(e.toNodeId));
      
      // Se não houver outgoing descobertas, mas a gente puder seguir as já cobertas para estender a linha
      if (!nextEdge && options.fullChains) {
        nextEdge = out.find(e => !visitedForward.has(e.toNodeId));
      }

      if (nextEdge) {
        elements.push({
          nodeId: nextEdge.toNodeId,
          fromSlot: nextEdge.fromSlotName,
          toSlot: nextEdge.toSlotName
        });
        uncoveredEdges.delete(nextEdge.id);
        currNodeId = nextEdge.toNodeId;
        visitedForward.add(currNodeId);
      } else {
        break;
      }
    }

    // Formatar esta cadeia em texto
    let chainText = '';
    elements.forEach((elem, index) => {
      const nodeName = getNodeName(elem.nodeId);
      if (index === 0) {
        chainText = nodeName;
      } else {
        chainText += ` (${elem.fromSlot}) -> (${elem.toSlot}) ${nodeName}`;
      }
    });

    chains.push(chainText);

    // Salvaguarda caso algum link fique travado num loop e não seja coberto
    // Se passar uma iteração sem remover nenhum link de uncoveredEdges, removemos o startEdge manualmente
    if (uncoveredEdges.has(startEdgeId)) {
      uncoveredEdges.delete(startEdgeId);
    }
  }

  // Extrair nós do texto gerado
  workflow.nodes.forEach(node => {
    if (!options.ignoreUnconnected && !connectedNodeIds.has(node.id)) {
      chains.push(getNodeName(node.id));
    }
  });

  return chains.join('\n');
}

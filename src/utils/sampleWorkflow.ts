export const SAMPLE_WORKFLOW = {
  "id": "35a7e5ed-e17e-4340-bc11-3cf1b81ea478",
  "revision": 0,
  "last_node_id": 57,
  "last_link_id": 114,
  "nodes": [
    {
      "id": 8,
      "type": "VAEDecode",
      "pos": [1271.8748590312723, 147.76471335610395],
      "size": [210, 46],
      "flags": {},
      "order": 9,
      "mode": 0,
      "inputs": [
        { "name": "samples", "type": "LATENT", "link": 10 },
        { "name": "vae", "type": "VAE", "link": 11 }
      ],
      "outputs": [
        { "name": "IMAGE", "type": "IMAGE", "slot_index": 0, "links": [77] }
      ],
      "properties": {
        "Node name for S&R": "VAEDecode",
        "cnr_id": "comfy-core",
        "ver": "0.3.40"
      },
      "widgets_values": []
    },
    {
      "id": 45,
      "type": "CLIPLoader",
      "pos": [14.613076680630343, 396.35571958828405],
      "size": [270, 106],
      "flags": {},
      "order": 0,
      "mode": 0,
      "inputs": [],
      "outputs": [
        { "name": "CLIP", "type": "CLIP", "links": [99, 100] }
      ],
      "properties": {
        "Node name for S&R": "CLIPLoader",
        "cnr_id": "comfy-core",
        "ver": "0.11.0"
      },
      "widgets_values": [
        "qwen_3_06b_base.safetensors",
        "stable_diffusion",
        "default"
      ]
    },
    {
      "id": 15,
      "type": "VAELoader",
      "pos": [14.554245627951119, 149.9768697281723],
      "size": [270, 58],
      "flags": {},
      "order": 1,
      "mode": 0,
      "inputs": [],
      "outputs": [
        { "name": "VAE", "type": "VAE", "links": [11] }
      ],
      "properties": {
        "Node name for S&R": "VAELoader",
        "cnr_id": "comfy-core",
        "ver": "0.3.40"
      },
      "widgets_values": ["qwen_image_vae.safetensors"]
    },
    {
      "id": 12,
      "type": "CLIPTextEncode",
      "pos": [396.58741463170793, 694.1245923889926],
      "size": [534.9724235619389, 113.27148951094102],
      "flags": {},
      "order": 3,
      "mode": 0,
      "inputs": [
        { "name": "clip", "type": "CLIP", "link": 99 }
      ],
      "outputs": [
        { "name": "CONDITIONING", "type": "CONDITIONING", "links": [111] }
      ],
      "title": "CLIP Text Encode (Negative Prompt)",
      "properties": {
        "Node name for S&R": "CLIPTextEncode",
        "cnr_id": "comfy-core",
        "ver": "0.3.65"
      },
      "widgets_values": [
        "worst quality, low quality, score_1, score_2, score_3, artist name"
      ]
    },
    {
      "id": 1,
      "type": "PreviewImage",
      "pos": [1270.985848991242, 244.28516798983227],
      "size": [519.5355789562889, 612.0218737893854],
      "flags": {},
      "order": 10,
      "mode": 0,
      "inputs": [
        { "name": "images", "type": "IMAGE", "link": 77 }
      ],
      "outputs": [],
      "properties": {
        "Node name for S&R": "PreviewImage",
        "cnr_id": "comfy-core",
        "ver": "0.3.40"
      },
      "widgets_values": []
    },
    {
      "id": 44,
      "type": "UNETLoader",
      "pos": [-2.1869416299165323, 253.15572264004186],
      "size": [307.5999755859375, 82],
      "flags": {},
      "order": 2,
      "mode": 0,
      "inputs": [],
      "outputs": [
        { "name": "MODEL", "type": "MODEL", "links": [106] }
      ],
      "properties": {
        "Node name for S&R": "UNETLoader",
        "cnr_id": "comfy-core",
        "ver": "0.11.0"
      },
      "widgets_values": ["anima-preview3-base.safetensors", "default"]
    },
    {
      "id": 53,
      "type": "LoraLoaderModelOnly",
      "pos": [460.7588516762644, 79.04409950169006],
      "size": [374.3147822739379, 82],
      "flags": {},
      "order": 5,
      "mode": 0,
      "inputs": [
        { "name": "model", "type": "MODEL", "link": 106 }
      ],
      "outputs": [
        { "name": "MODEL", "type": "MODEL", "links": [108] }
      ],
      "properties": {
        "Node name for S&R": "LoraLoaderModelOnly",
        "cnr_id": "comfy-core",
        "ver": "0.21.0"
      },
      "widgets_values": ["anima-turbo-lora-v0.2.safetensors", 1]
    },
    {
      "id": 54,
      "type": "LoraLoaderModelOnly",
      "pos": [463.0043036949217, 215.09315691734696],
      "size": [374.3147822739379, 82],
      "flags": {},
      "order": 7,
      "mode": 0,
      "inputs": [
        { "name": "model", "type": "MODEL", "link": 108 }
      ],
      "outputs": [
        { "name": "MODEL", "type": "MODEL", "links": [109] }
      ],
      "properties": {
        "Node name for S&R": "LoraLoaderModelOnly",
        "cnr_id": "comfy-core",
        "ver": "0.21.0"
      },
      "widgets_values": ["anime_real_anima_lora_cont.safetensors", 1]
    },
    {
      "id": 11,
      "type": "CLIPTextEncode",
      "pos": [393.458447636815, 361.3967600452695],
      "size": [543.5120797468438, 293.0990356686963],
      "flags": {},
      "order": 4,
      "mode": 0,
      "inputs": [
        { "name": "clip", "type": "CLIP", "link": 100 }
      ],
      "outputs": [
        { "name": "CONDITIONING", "type": "CONDITIONING", "links": [110] }
      ],
      "title": "CLIP Text Encode (Positive Prompt)",
      "properties": {
        "Node name for S&R": "CLIPTextEncode",
        "cnr_id": "comfy-core",
        "ver": "0.3.65"
      },
      "widgets_values": ["prompt...\n"]
    },
    {
      "id": 19,
      "type": "KSampler",
      "pos": [954.270786069544, 249.10107877055734],
      "size": [297.15631103515625, 266.5079040527344],
      "flags": {},
      "order": 8,
      "mode": 0,
      "inputs": [
        { "name": "model", "type": "MODEL", "link": 109 },
        { "name": "positive", "type": "CONDITIONING", "link": 112 },
        { "name": "negative", "type": "CONDITIONING", "link": 113 },
        { "name": "latent_image", "type": "LATENT", "link": 114 }
      ],
      "outputs": [
        { "name": "LATENT", "type": "LATENT", "slot_index": 0, "links": [10] }
      ],
      "properties": {
        "Node name for S&R": "KSampler",
        "cnr_id": "comfy-core",
        "ver": "0.3.40"
      },
      "widgets_values": [317540284430193, "increment", 12, 1, "er_sde", "simple", 1]
    },
    {
      "id": 57,
      "type": "InpaintModelConditioning",
      "pos": [623.0653369735847, 893.4012426154709],
      "size": [270, 138],
      "flags": { "collapsed": false },
      "order": 6,
      "mode": 0,
      "inputs": [
        { "name": "positive", "type": "CONDITIONING", "link": 110 },
        { "name": "negative", "type": "CONDITIONING", "link": 111 },
        { "name": "vae", "type": "VAE", "link": null },
        { "name": "pixels", "type": "IMAGE", "link": null },
        { "name": "mask", "type": "MASK", "link": null }
      ],
      "outputs": [
        { "name": "positive", "type": "CONDITIONING", "links": [112] },
        { "name": "negative", "type": "CONDITIONING", "links": [113] },
        { "name": "latent", "type": "LATENT", "links": [114] }
      ],
      "properties": { "Node name for S&R": "InpaintModelConditioning" },
      "widgets_values": [true]
    }
  ],
  "links": [
    [10, 19, 0, 8, 0, "LATENT"],
    [11, 15, 0, 8, 1, "VAE"],
    [77, 8, 0, 1, 0, "IMAGE"],
    [99, 45, 0, 12, 0, "CLIP"],
    [100, 45, 0, 11, 0, "CLIP"],
    [106, 44, 0, 53, 0, "MODEL"],
    [108, 53, 0, 54, 0, "MODEL"],
    [109, 54, 0, 19, 0, "MODEL"],
    [110, 11, 0, 57, 0, "CONDITIONING"],
    [111, 12, 0, 57, 1, "CONDITIONING"],
    [112, 57, 0, 19, 1, "CONDITIONING"],
    [113, 57, 1, 19, 2, "CONDITIONING"],
    [114, 57, 2, 19, 3, "LATENT"]
  ],
  "groups": [],
  "config": {},
  "extra": {
    "ds": {
      "scale": 1.0152559799477054,
      "offset": [-393.4845733960738, 106.914615210308]
    },
    "workflowRendererVersion": "LG",
    "frontendVersion": "1.45.15",
    "VHS_latentpreview": false,
    "VHS_latentpreviewrate": 0,
    "VHS_MetadataImage": true,
    "VHS_KeepIntermediate": true
  },
  "version": 0.4
};

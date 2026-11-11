# RFC & Feature Specification: Multi-User Collaborative Sessions (Team Sessions)

## 1. Context & Motivation

Currently, OpenCode operates primarily as a single-developer environment. When multiple developers (or multiple agents) attempt to collaborate on the same codebase using a shared OpenCode server, they face two major problems:

1. **Shared Quota Burn:** If User A triggers a task on a shared instance, it consumes User A's (or the host's) configured provider quota/keys.
2. **Concurrent Edits & Collisions:** Edits made by one agent or developer directly overwrite working files without real-time synchronization or visual awareness among participants.

## 2. Core Architectural Pillars

### A. Host & Peer Architecture (Zero External Auth)

- **Host (Owner):** Runs `opencode serve` with collaboration enabled. The host machine owns the filesystem and execution sandbox.
- **Peers (Guests):** Connect via an ephemeral pairing token over HTTPS/WebSocket (e.g., via Cloudflare Tunnel or local network).
- **Security Guardrail:** Guest agents can only propose file diffs (`patch.propose`). They have **zero direct shell execution** permissions on the host machine unless explicitly approved by the host user.

### B. Decentralized BYOK (Bring Your Own Key)

- Each connected client sends its model requests from its own client environment or provides its own ephemeral credential headers.
- The host's API keys are never used to fund guest LLM calls.

### C. Live Awareness & Agent-to-Agent Event Bus

- A real-time WebSocket channel broadcasts active agent intents:
  ```json
  {
    "type": "agent.intent",
    "peerId": "guest-42",
    "file": "lib/views/main_screen.dart",
    "lines": [40, 75],
    "action": "refactoring checkout button"
  }
  ```
- Other agents receive this broadcast in their local session context to avoid conflicting edits.

### D. File Locking & Arbiter Gate

- Active edit ranges are locked transiently.
- When a guest agent completes a patch, the host UI displays a 1-click **Live Diff Approval** bar before merging into the main working tree.

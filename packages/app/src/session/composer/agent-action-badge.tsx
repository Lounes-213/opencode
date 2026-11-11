import { Icon } from "@opencode/ui/icon"
import type { IconName } from "@opencode/ui/icons/catalog"
import { Component, Show } from "solid-js"
import "./agent-action-badge.css"

export type AgentOperationalPhase = "idle" | "explore" | "plan" | "edit" | "verify"

export interface AgentActionBadgeProps {
  phase: AgentOperationalPhase
  label?: string
  toolName?: string
}

const PHASE_ICONS: Record<AgentOperationalPhase, IconName> = {
  idle: "chat-bubble",
  explore: "search",
  plan: "compass" as IconName,
  edit: "code",
  verify: "checkmark",
}

const PHASE_LABELS: Record<AgentOperationalPhase, string> = {
  idle: "Ready",
  explore: "Exploring AST & Code",
  plan: "Planning Architecture",
  edit: "Surgical Patching",
  verify: "Verifying & Testing",
}

/**
 * Clean Monoline Agent Action Badge
 * Conforms to strict design rules:
 * - 1.6px monoline stroke, uses currentColor
 * - Zero emoji, zero colored status dots
 * - Respects prefers-reduced-motion
 */
export const AgentActionBadge: Component<AgentActionBadgeProps> = (props) => {
  const currentIcon = () => PHASE_ICONS[props.phase] || "code"
  const currentText = () => props.label || PHASE_LABELS[props.phase] || "Processing"

  return (
    <div class="agent-action-badge" data-phase={props.phase} role="status" aria-live="polite">
      <span class="agent-action-icon" aria-hidden="true">
        <Icon name={currentIcon()} />
      </span>
      <span class="agent-action-label truncate">{currentText()}</span>
      <Show when={props.toolName}>
        <span class="agent-action-tool truncate font-mono">{props.toolName}</span>
      </Show>
    </div>
  )
}

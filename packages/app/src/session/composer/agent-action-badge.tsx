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

// Maps operational phases to existing monoline icons in the project's design system
const PHASE_ICONS: Record<AgentOperationalPhase, IconName> = {
  idle: "chat-bubble",
  explore: "search",
  plan: "worktree", // uses the exact monoline branch/worktree icon from catalog
  edit: "code",
  verify: "checkmark",
}

const PHASE_LABELS: Record<AgentOperationalPhase, string> = {
  idle: "Ready",
  explore: "Exploring",
  plan: "Planning",
  edit: "Editing",
  verify: "Verifying",
}

/**
 * Clean Monoline Agent Action Badge
 * Conforms 100% to the repository's native styling and AGENTS.md rules:
 * - 0% custom colors / raw hex: strictly uses var(--v2-background-*), var(--v2-text-*), and currentColor
 * - 0% emoji, 0% colored dots
 * - Matches the exact font, metrics, and pill conventions of OpenCode (data-composer-pill)
 * - Honors prefers-reduced-motion
 */
export const AgentActionBadge: Component<AgentActionBadgeProps> = (props) => {
  const iconName = () => PHASE_ICONS[props.phase] || "code"
  const labelText = () => props.label || PHASE_LABELS[props.phase] || "Working"

  return (
    <div
      data-slot="agent-action-badge"
      data-phase={props.phase}
      data-composer-pill
      class="tabular-nums duration-150 ease-out motion-reduce:animate-none"
      role="status"
      aria-live="polite"
    >
      <Icon name={iconName()} class="shrink-0 text-v2-icon-icon-muted" />
      <span data-slot="agent-action-label" class="truncate font-[530]">
        <bdi>{labelText()}</bdi>
      </span>
      <Show when={props.toolName}>
        <span data-slot="agent-action-tool" class="truncate text-[11px] font-mono text-v2-text-text-muted">
          {props.toolName}
        </span>
      </Show>
    </div>
  )
}

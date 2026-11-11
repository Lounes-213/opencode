import { Show } from "solid-js"
import { Icon } from "@opencode/ui/icon"

export function TimelineWorkingIndicator(props: { isWorking: boolean; currentTool?: string; path?: string }) {
  return (
    <Show when={props.isWorking}>
      <div
        data-component="timeline-working-indicator"
        class="mt-3 flex items-center gap-2 px-2 py-1.5 rounded-lg border border-v2-border-hairline bg-v2-background-bg-layer-02 text-v2-text-text-base text-[12px] font-[530] font-mono select-none"
      >
        <Show when={props.currentTool === "shell"}>
          <Icon name="monitor" class="w-3.5 h-3.5 text-v2-icon-icon-muted shrink-0" />
          <span class="text-v2-text-text-muted">Terminal:</span>
          <span class="truncate">{props.path || "running command..."}</span>
        </Show>

        <Show when={props.currentTool === "edit" || props.currentTool === "write"}>
          <Icon name="edit" class="w-3.5 h-3.5 text-v2-icon-icon-muted shrink-0" />
          <span class="text-v2-text-text-muted">Editing:</span>
          <span class="truncate">{props.path || "patching file..."}</span>
        </Show>

        <Show
          when={
            !props.currentTool ||
            (props.currentTool !== "shell" && props.currentTool !== "edit" && props.currentTool !== "write")
          }
        >
          <Icon name="search" class="w-3.5 h-3.5 text-v2-icon-icon-muted shrink-0" />
          <span class="truncate animate-pulse">Processing...</span>
        </Show>
      </div>
    </Show>
  )
}

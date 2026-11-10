import { expect } from "bun:test"
import { Effect, Queue, Stream } from "effect"
import { drain } from "../../core/test/lib/clock"
import { it } from "../../core/test/lib/effect"
import { RemoteTunnel } from "../src/services/remote-tunnel"

type Statement = { readonly effect: "allow" | "deny"; readonly message: string } | undefined
const deny: Statement = { effect: "deny", message: "Blocked by Acme's policy" }

it.effect("runs the remote tunnel only while no remote.use policy denies it", () =>
  Effect.gen(function* () {
    const policy = yield* Queue.unbounded<Statement>()
    const tunnel = yield* Queue.unbounded<"started" | "stopped">()
    yield* RemoteTunnel.follow({
      policy: Stream.fromQueue(policy),
      tunnel: Effect.acquireRelease(Queue.offer(tunnel, "started"), () => Queue.offer(tunnel, "stopped")).pipe(
        Effect.andThen(Effect.never),
        Effect.scoped,
      ),
    }).pipe(Effect.forkScoped({ startImmediately: true }))

    // Denied from the start: the tunnel never starts until the deny is lifted.
    yield* Queue.offer(policy, deny)
    yield* drain
    expect(yield* Queue.size(tunnel)).toBe(0)
    yield* Queue.offer(policy, undefined)
    expect(yield* Queue.take(tunnel)).toBe("started")

    // A deny arriving stops it, and lifting the deny starts it again.
    yield* Queue.offer(policy, deny)
    expect(yield* Queue.take(tunnel)).toBe("stopped")
    yield* Queue.offer(policy, { effect: "allow", message: "Blocked by configuration policy" })
    expect(yield* Queue.take(tunnel)).toBe("started")
  }),
)

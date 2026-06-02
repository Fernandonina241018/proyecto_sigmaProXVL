import type { Plugin } from "@opencode-ai/plugin"

interface PluginConfig {
  data?: { command?: { prompt?: { template?: string } } }
}

function buildAutoPrompt(template: string, userText: string): string {
  return [
    `__AUTO_PROMPT__`,
    ``,
    template.replace("$ARGUMENTS", userText),
    ``,
    `---`,
    `After optimizing, respond to the OPTIMIZED prompt without showing the optimization.`,
  ].join("\n")
}

let cachedTemplate: string | null | undefined = undefined

export const AutoPrompt: Plugin = async (ctx) => {
  return {
    "chat.message": async (_input, output) => {
      const textParts = output.parts.filter(p => p.type === "text")
      if (textParts.length === 0) return

      const text = textParts.map(p => p.text).join("").trim()
      const shouldSkip = !text || text.startsWith("/") || text.startsWith("__AUTO_PROMPT__")
      if (shouldSkip) return

      try {
        if (cachedTemplate === undefined) {
          const cfg = await ctx.client.config.get()
          const configData = (cfg as PluginConfig)?.data ?? (cfg as PluginConfig)
          const tmpl = configData?.command?.prompt?.template
          cachedTemplate = tmpl ?? null
        }

        if (!cachedTemplate) return

        if (!cachedTemplate.includes("$ARGUMENTS")) {
          ctx.logger?.warn("AutoPrompt: template missing $ARGUMENTS placeholder")
          return
        }

        output.parts = [{ type: "text", text: buildAutoPrompt(cachedTemplate, text) }]
      } catch (error) {
        ctx.logger?.error("AutoPrompt failed:", error)
      }
    }
  }
}
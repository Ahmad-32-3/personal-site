export type Project = {
  t: string
  tag?: string
  d?: string
  claim?: string
  method?: string
  feat?: 1
  walk?: string
  tone?: string
  art: string
  github?: string
}

export type ProjectTier = {
  id: string
  label: string
  items: Project[]
}

const GH = "https://github.com/Ahmad-32-3"

export const PROJECT_TIERS: ProjectTier[] = [
  {
    id: "featured",
    label: "Featured",
    items: [
      {
        t: "SentioNet",
        tag: "EEG · PyTorch",
        art: "eeg",
        walk: "/work/sentionet/",
        tone: "neural",
        github: `${GH}/SentioNet-EEG`,
        d: "I train on raw EEG from epilepsy patients and try to flag the minutes before a seizure. The test set is patients the model never saw, so it cannot just memorize one brain.",
        claim:
          "Flag the run-up to a seizure from raw EEG, on patients the model never trained on.",
        method:
          "Train on some patients, then test on held-out patients so it cannot memorize one brain.",
        feat: 1,
      },
      {
        t: "EchoAsk",
        tag: "LLM infra · Python",
        art: "cache",
        walk: "/work/echoask/",
        tone: "paper",
        github: `${GH}/EchoAsk`,
        d: "A cache in front of an LLM so 'reset my password' and 'I forgot my password' can share one answer. I also score when that helps and when it hands back the wrong thing.",
        claim: "Don't pay twice when two questions mean the same thing.",
        method:
          "Score when similar phrasing should share an answer, and when the cache hands back the wrong one.",
        feat: 1,
      },
      {
        t: "Outlook Cleaner",
        tag: "React · Microsoft Graph",
        art: "mail",
        walk: "/work/inboxsweep/",
        tone: "inbox",
        d: "I built this to clear a 15-year Outlook inbox. You preview the matches, then delete in batches of 20. Outlook's own bulk delete gives up on that volume.",
        claim: "Clear a 15-year Outlook inbox in batches Graph can finish.",
        method:
          "Sign in with Microsoft, preview matches, then delete in batches of 20. Soft delete lands in Deleted Items.",
        feat: 1,
      },
    ],
  },
  {
    id: "db",
    label: "Real-World Datasets",
    items: [
      {
        t: "WattAhead",
        tag: "Time series",
        art: "city",
        feat: 1,
        walk: "/work/wattahead/",
        tone: "watt",
        github: `${GH}/WattAhead`,
        d: "Next-hour power forecast trained on one building, tested on a building it never saw. Memorize the first and the second falls apart.",
      },
      {
        t: "AirTrue",
        tag: "Sensors",
        art: "sensor",
        walk: "/work/airtrue/",
        tone: "air",
        github: `${GH}/AirTrue`,
        d: "Cheap backyard air sensors don't match the official monitors. I learn a correction from sensors parked next to official ones, then test at a monitor I held out.",
      },
      {
        t: "DigHere",
        tag: "Sensors · ranking",
        art: "pipes",
        walk: "/work/dighere/",
        tone: "water",
        github: `${GH}/DigHere`,
        d: "Water pipes can leak for years. I turn pressure readings into a ranked spot to dig, then check how often the real leak sits near the top guess.",
      },
      {
        t: "SpanWatch",
        tag: "Anomaly detection",
        art: "bridge",
        walk: "/work/spanwatch/",
        tone: "steel",
        github: `${GH}/SpanWatch`,
        d: "A steel bridge wore sensors before and after it cracked. I learn what healthy looks like and flag odd behavior after the crack, with a hard cap on false alarms.",
      },
      {
        t: "GlitchName",
        tag: "LIGO · vision",
        art: "glitch",
        walk: "/work/glitchname/",
        tone: "gravity",
        github: `${GH}/GlitchName`,
        d: "Gravitational-wave detectors pick up bursts of junk noise. I train to name the shapes on one detector and test on another, so I cannot lean on one site's quirks.",
      },
      {
        t: "HiveHum",
        tag: "Audio · regression",
        art: "hive",
        feat: 1,
        walk: "/work/hivehum/",
        tone: "honey",
        github: `${GH}/HiveHum`,
        d: "Ten rooftop hives recorded a year of sound and temperature. I predict colony strength, then test on a hive left out so the model cannot cheat by recognizing which box it is hearing.",
      },
    ],
  },
  {
    id: "ds",
    label: "Data Science",
    items: [
      {
        t: "TurnWise",
        tag: "Deep learning",
        art: "rotate",
        feat: 1,
        walk: "/work/turnwise/",
        tone: "copper",
        github: `${GH}/TurnWise`,
        d: "Train only on upright logos, then rotate the test set. A plain network usually trips. One that knows about rotation should still name the mark.",
      },
      {
        t: "FormulaFind",
        tag: "KAN vs MLP",
        art: "formula",
        feat: 1,
        walk: "/work/formulafind/",
        tone: "mint",
        github: `${GH}/FormulaFind`,
        d: "I bury a real formula under noisy points and ask a KAN and an MLP to recover it, then check both on clean values they never trained on.",
      },
      {
        t: "DriftAlign",
        tag: "Optimal transport",
        art: "drift",
        walk: "/work/driftalign/",
        tone: "air",
        github: `${GH}/DriftAlign`,
        d: "Train on data that looks one way, test on data that has drifted. Before scoring, I slide the training cloud toward the test cloud and ask if that actually buys accuracy.",
      },
      {
        t: "MarketDigest",
        tag: "GARCH · volatility",
        art: "candles",
        walk: "/work/marketdigest/",
        tone: "ticker",
        github: `${GH}/MarketDigest-GARCH`,
        d: "Markets have calm spells and stormy spells that bunch together. I test whether a GARCH model beats a plain rolling average on tomorrow's swings.",
      },
      {
        t: "MarketMood",
        tag: "HMM · regimes",
        art: "moods",
        walk: "/work/marketmood/",
        tone: "mood",
        github: `${GH}/MarketMood`,
        d: "I fit a hidden Markov model to recover calm, choppy, and crashy moods, then check it against a crude volatility cutoff.",
      },
      {
        t: "GrepOrEmbed",
        tag: "Grep · embeddings",
        art: "grep",
        walk: "/work/greporembed/",
        tone: "grep",
        github: `${GH}/GrepOrEmbed`,
        d: "A live case: is grep enough, or do embeddings win on this corpus?",
      },
    ],
  },
  {
    id: "ml",
    label: "Machine Learning",
    items: [
      {
        t: "CopyPath",
        tag: "Interpretability",
        art: "circuit",
        feat: 1,
        walk: "/work/copypath/",
        tone: "copy",
        github: `${GH}/CopyPath`,
        d: "A tiny network can ace a copy puzzle while hiding where it copies. I train one, switch off the parts I think are responsible, and see if the answer changes the way I predicted.",
      },
      {
        t: "TrapCam",
        tag: "Self-supervised",
        art: "cam",
        walk: "/work/trapcam/",
        tone: "forest",
        github: `${GH}/TrapCam`,
        d: "Camera traps in different spots have different lighting. I train an encoder with no labels, freeze it, and check whether it still recognizes animals on a camera it never saw.",
      },
      {
        t: "WordFirst",
        tag: "Transformers",
        art: "tokens",
        feat: 1,
        walk: "/work/wordfirst/",
        tone: "ink",
        github: `${GH}/WordFirst`,
        d: "A language model needs to know which word came first. I compare a few ways of telling it, then feed it text longer than anything it trained on to see which way holds up.",
      },
      {
        t: "RecallFix",
        tag: "pgvector",
        art: "search",
        walk: "/work/recallfix/",
        tone: "search",
        github: `${GH}/RecallFix`,
        d: "Vector search can miss the right results once you add filters. I test whether tuned queries find more of what you asked for than the stock settings.",
      },
      {
        t: "SplitCheck",
        tag: "MLOps",
        art: "split",
        walk: "/work/splitcheck/",
        tone: "split",
        github: `${GH}/SplitCheck`,
        d: "Models often look great in testing then flop live because features drift between the two. I built a check that catches that mismatch before you trust the score.",
      },
      {
        t: "FlowMatch",
        tag: "Deep learning",
        art: "flow",
        walk: "/work/flowmatch/",
        tone: "flow",
        github: `${GH}/FlowMatch`,
        d: "Conditional flow matching on a density I already know, so I can see whether the model actually learned the shape or just memorized samples.",
      },
    ],
  },
  {
    id: "more",
    label: "More Projects",
    items: [
      {
        t: "Porter",
        tag: "Waiting-room proxy",
        art: "crowd",
        feat: 1,
        walk: "/work/porter/",
        tone: "crowd",
        github: `${GH}/Porter`,
        d: "A waiting-room proxy so a stampede of visitors does not knock over origin.",
      },
      {
        t: "LiveHedge",
        tag: "Kalman · hedge",
        art: "hedge",
        walk: "/work/livehedge/",
        tone: "hedge",
        github: `${GH}/LiveHedge`,
        d: "Two related stocks usually move together, but the link drifts. A Kalman filter updates the hedge as it goes. I test that against locking the hedge in once.",
      },
      {
        t: "Cost Autopilot",
        tag: "LLM routing",
        art: "route",
        feat: 1,
        walk: "/work/cost-autopilot/",
        tone: "gold",
        github: `${GH}/Cost-Autopilot`,
        d: "Route easy chatbot questions off frontier models so you stop paying frontier prices for them.",
      },
      {
        t: "AQ-Tracker",
        tag: "Air quality",
        art: "smog",
        walk: "/work/aq-tracker/",
        tone: "ocean",
        github: `${GH}/AQ-Tracker`,
        d: "Live air and heat tips for Lahore, Karachi, and Islamabad from Open-Meteo. The overlay is the app.",
      },
      {
        t: "Machine Debugger",
        tag: "Fault detection",
        art: "gears",
        walk: "/work/machine-debugger/",
        tone: "machine",
        github: `${GH}/Machine-Debugger`,
        d: "Fault detection from machine audio, tested on a machine left out of training.",
      },
      {
        t: "PathTape",
        tag: "Execution",
        art: "path",
        walk: "/work/pathtape/",
        tone: "tape",
        github: `${GH}/PathTape`,
        d: "Almgren-Chriss execution versus TWAP on synthetic paths.",
      },
      {
        t: "BurstTape",
        tag: "Hawkes",
        art: "burst",
        walk: "/work/bursttape/",
        tone: "burst",
        github: `${GH}/BurstTape`,
        d: "Hawkes bursts in a market event stream.",
      },
      {
        t: "QuoteBook",
        tag: "Order book",
        art: "book",
        walk: "/work/quotebook/",
        tone: "quote",
        github: `${GH}/QuoteBook`,
        d: "Inventory-aware quotes on a toy order book.",
      },
      {
        t: "AsOfJoin",
        tag: "MLOps",
        art: "join",
        walk: "/work/asofjoin/",
        tone: "asof",
        github: `${GH}/AsOfJoin`,
        d: "A point-in-time join that does not peek into the future.",
      },
      {
        t: "Cache Regret",
        tag: "Systems",
        art: "regret",
        walk: "/work/cache-regret/",
        tone: "regret",
        github: `${GH}/Cache-Regret`,
        d: "Spend a refresh budget on the cache keys that actually move the score.",
      },
      {
        t: "RiverKafka",
        tag: "Streaming ML",
        art: "river",
        walk: "/work/riverkafka/",
        tone: "river",
        github: `${GH}/RiverKafka`,
        d: "Online learning on a drifting Kafka event stream.",
      },
    ],
  },
]

export function walkSlug(project: Project): string | null {
  if (!project.walk) return null
  const parts = project.walk.split("/").filter(Boolean)
  const work = parts.indexOf("work")
  const slug = work >= 0 ? parts[work + 1] : parts.at(-1)
  return slug || null
}

export function projectByWalkSlug(slug: string): Project | undefined {
  const needle = slug.trim().toLowerCase()
  if (!needle) return undefined
  for (const tier of PROJECT_TIERS) {
    const found = tier.items.find(
      (item) => walkSlug(item)?.toLowerCase() === needle
    )
    if (found) return found
  }
}

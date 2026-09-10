"""Create a public GitHub repo per portfolio project and push source (no secrets, no node_modules)."""

from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path

IGNORE = {
    "node_modules",
    "dist",
    ".venv",
    "venv",
    "__pycache__",
    ".pytest_cache",
    ".git",
    ".cursor",
    ".turbo",
    "coverage",
    "data",
    "datasets",
    ".opencode",
    ".github",
}

REPOS = [
    ("SentioNet-EEG", r"C:\dev\chb-mit-eeg", "Leave-one-patient-out seizure detection and forecasting on CHB-MIT EEG."),
    ("EchoAsk", r"C:\dev\semantic-cache", "Semantic cache in front of an LLM, with an honest look at when similar questions should share an answer."),
    ("HiveHum", r"C:\dev\hives", "Predict colony strength from in-hive audio, tested on a hive the model never heard."),
    ("WattAhead", r"C:\dev\buildings", "Next-hour building electricity forecast, tested on a building held out."),
    ("AirTrue", r"C:\dev\sensors", "Calibrate cheap air sensors to official monitors on a held-out site."),
    ("DigHere", r"C:\dev\leaks", "Rank where to dig for a water leak from pressure readings."),
    ("SpanWatch", r"C:\dev\bridges", "Flag a cracked bridge from sensor data with a hard cap on false alarms."),
    ("GlitchName", r"C:\dev\glitches", "Name LIGO glitch shapes on one detector and test on another."),
    ("TurnWise", r"C:\dev\data-science-projects\equivariant", "Train on upright marks, test on turned ones."),
    ("FormulaFind", r"C:\dev\data-science-projects\kan-laws", "Recover a planted formula with KAN vs MLP on held-out values."),
    ("DriftAlign", r"C:\dev\data-science-projects\transport", "Does optimal transport help when train and test data have drifted?"),
    ("MarketDigest-GARCH", r"C:\dev\quant-projects\vol-cluster", "GARCH vs a rolling average for clustered market swings."),
    ("MarketMood", r"C:\dev\quant-projects\regimes", "Hidden Markov moods in markets vs a crude volatility cutoff."),
    ("LiveHedge", r"C:\dev\quant-projects\kalman-spread", "A Kalman filter that lets a stock hedge drift instead of locking it in."),
    ("CopyPath", r"C:\dev\data-science-projects\circuits", "Interpretability on a tiny copy-task network."),
    ("TrapCam", r"C:\dev\data-science-projects\pretext", "Self-supervised camera-trap features, probed on a new camera."),
    ("WordFirst", r"C:\dev\positions", "Positional encodings bake-off with length extrapolation."),
    ("RecallFix", r"C:\dev\ML-projects\hnsw-recall", "Does filtered vector search actually return the right document?"),
    ("SplitCheck", r"C:\dev\ML-projects\skew", "Catch Postgres vs Redis feature mismatch before you trust a model."),
    ("Porter", r"C:\dev\porter", "A waiting-room proxy so a stampede of visitors does not knock over origin."),
    ("GrepOrEmbed", r"C:\dev\grep-vs-embeddings", "Live case study: is grep all you need, or do embeddings win?"),
    ("Cost-Autopilot", r"C:\dev\cost-autopilot", "Route easy chatbot questions off frontier models."),
    ("Machine-Debugger", r"C:\dev\machineDebugger", "Fault detection from machine audio, leave-one-machine-out."),
    ("FlowMatch", r"C:\dev\data-science-projects\flows", "Conditional flow matching on a known density."),
    ("PathTape", r"C:\dev\quant-projects\exec-path", "Almgren-Chriss execution vs TWAP on synthetic paths."),
    ("BurstTape", r"C:\dev\quant-projects\hawkes-bursts", "Hawkes bursts in a market event stream."),
    ("QuoteBook", r"C:\dev\quant-projects\inventory-quotes", "Inventory-aware quotes."),
    ("AsOfJoin", r"C:\dev\ML-projects\pitjoin", "A point-in-time join that does not peek into the future."),
    ("Cache-Regret", r"C:\dev\ML-projects\regret", "Spend a refresh budget on the cache keys that move the score."),
    ("RiverKafka", r"C:\dev\ML-projects\river-kafka", "Online learning on a drifting Kafka event stream."),
    ("AQ-Tracker", r"C:\dev\AQ-Tracker", "Air quality tracker."),
    ("OmniRoute", r"C:\dev\OmniRoute", "AI gateway."),
    ("Graphify", r"C:\dev\graphify", "Knowledge graphs."),
    ("SheetDuel", r"C:\dev\tabular-regimes", "Tabular foundation models vs gradient-boosted trees."),
    ("BugSoon", r"C:\dev\SWE-projects\jit-bugs", "Just-in-time bug prediction."),
    ("FlakeHunt", r"C:\dev\SWE-projects\flakes", "Flaky test hunting."),
    ("Blame-Lines", r"C:\dev\SWE-projects\blame-lines", "Blame-line analysis."),
    ("CIGuess", r"C:\dev\SWE-projects\ci-fail", "Guess which CI check will fail."),
    ("BandCheck", r"C:\dev\data-science-projects\bands", "Uncertainty bands."),
    ("HoleMap", r"C:\dev\data-science-projects\holes", "Topological holes."),
    ("SketchLS", r"C:\dev\data-science-projects\sketches", "Numerical sketches."),
    ("SparseCatch", r"C:\dev\data-science-projects\sparse", "Sparse signals."),
    ("CurveNet", r"C:\dev\data-science-projects\spirals", "Spiral / curve networks."),
]


def ignore(_dir, names):
    return [n for n in names if n in IGNORE or n.endswith(".pyc")]


def run(cmd, cwd=None):
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, shell=True)


def publish(name: str, src: str, desc: str) -> str:
    root = Path(src)
    if not root.exists():
        return f"MISSING {name}"
    check = run(f"gh repo view Ahmad-32-3/{name}")
    exists = check.returncode == 0
    staging = Path(tempfile.mkdtemp(prefix=f"gh-{name}-"))
    try:
        shutil.copytree(root, staging / "src", ignore=ignore, dirs_exist_ok=True)
        work = staging / "src"
        run("git init -b main", cwd=work)
        run("git add -A", cwd=work)
        c = run('git commit -m "Add project source and walkthrough."', cwd=work)
        if c.returncode != 0:
            return f"NOCOMMIT {name}: {(c.stderr or c.stdout)[-400:]}"
        if exists:
            run(f"git remote add origin https://github.com/Ahmad-32-3/{name}.git", cwd=work)
            p = run("git push -u origin main", cwd=work)
            if p.returncode != 0:
                return f"PUSHFAIL {name}: {(p.stderr or p.stdout)[-400:]}"
            return f"PUSHED {name}"
        create = run(
            f'gh repo create Ahmad-32-3/{name} --public --description "{desc}" --source . --remote origin --push',
            cwd=work,
        )
        if create.returncode != 0:
            return f"CREATEFAIL {name}: {(create.stderr or create.stdout)[-500:]}"
        return f"CREATED {name}"
    finally:
        shutil.rmtree(staging, ignore_errors=True)


def main():
    for name, src, desc in REPOS:
        print(publish(name, src, desc), flush=True)


if __name__ == "__main__":
    main()

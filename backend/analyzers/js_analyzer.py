import subprocess
import tempfile
import json
import os

def analyze_js_code(code: str, filename="temp.js"):
    """Run eslint (must be installed globally or in a virtual environment)."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=".js", mode="w", encoding="utf-8") as tmp:
        tmp.write(code)
        tmp_path = tmp.name

    try:
        result = subprocess.run(
            ["eslint", "--format", "json", tmp_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=10
        )
        output = result.stdout.strip() or result.stderr.strip()
        try:
            return json.loads(output)
        except Exception:
            return {"raw": output}

    except subprocess.TimeoutExpired:
        return {"error": "Linter timed out"}

    finally:
        os.remove(tmp_path)
import subprocess
import json
import tempfile
import os

def analyze_python_code(code: str, filename="temp.py"):
    """Run pylint and return structured results."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=".py", mode="w", encoding="utf-8") as tmp:
        tmp.write(code)
        tmp_path = tmp.name

    try:
        result = subprocess.run(
            ["pylint", tmp_path, "--output-format=json"],
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
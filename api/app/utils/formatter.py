def format_loki_streams(raw_data):
    results = raw_data.get("data", {}).get("result", [])
    parsed = []

    for stream in results:
        labels = stream.get("stream", {})
        for ts, log_line in stream.get("values", []):
            parsed.append({
                "timestamp": ts,
                "message": log_line,
                "labels": labels
            })
    return parsed

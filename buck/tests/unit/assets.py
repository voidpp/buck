from datetime import datetime, timedelta


def past(diff_in_seconds: int = 0) -> datetime:
    return datetime.now() - timedelta(seconds = diff_in_seconds)

from pathlib import Path


class Folders:
    root = Path(__file__).parent.parent.resolve()
    templates = root / 'templates'
    static = root / 'static'

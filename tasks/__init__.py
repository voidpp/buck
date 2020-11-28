from invoke import Collection

from tasks import start, typescript, top
from tasks.typescript import generate

ns = Collection.from_module(top)

typescript_collection = Collection.from_module(typescript)
typescript_collection.add_collection(generate)

ns.add_collection(Collection.from_module(start))
ns.add_collection(typescript_collection)

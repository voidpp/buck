from invoke import Collection

from tasks import start, typescript


ns = Collection()

ns.add_collection(Collection.from_module(start))
ns.add_collection(Collection.from_module(typescript))

import {flatten} from "./tools";


test("flatten simple depth", () => {
    const res = flatten({tree: {fruit: "apple"}})
    expect(res).toStrictEqual({"tree.fruit": "apple"});
});

test("flatten deep", () => {
    const res = flatten({tree: {fruit: {apple: {seed: "mag"}}}})
    expect(res).toStrictEqual({"tree.fruit.apple.seed": "mag"});
});

test("flatten lot of value", () => {
    const res = flatten({
        tree: {
            fruit: {
                apple: "alma",
                pear: "korte",
            },
            leaf: "level",
        },
        animal: {
            cat: "cica",
        },
    })
    expect(res).toStrictEqual({
        "tree.fruit.apple": "alma",
        "tree.fruit.pear": "korte",
        "tree.leaf": "level",
        "animal.cat": "cica",
    });
});

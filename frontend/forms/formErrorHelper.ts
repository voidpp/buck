import { useState } from "react";
import { Error } from "../graphql-types-and-hooks";

export class FormErrorHelper<TFormData> {
    private readonly errors: Error[];
    private readonly setErrorList: (errors: Error[]) => void;

    constructor() {
        [this.errors, this.setErrorList] = useState<Error[]>([]);
    }

    setErrors(errors: Error[] | null) {
        this.setErrorList(errors ?? []);
    }

    resetErrors() {
        this.setErrorList([]);
    }

    hasError(name: keyof TFormData): boolean {
        for (const err of this.errors) {
            if (err.path[0] == name)
                return true
        }
        return false;
    }

    getErrors(name: keyof TFormData): Error[] {
        return this.errors.filter(e => e.path[0] == name);
    }
}

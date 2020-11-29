const messages = {
    en: {
        createTimer: "Create timer",
        startTimer: "Start timer",
        name: "Name",
        length: "Length (eg 30m)",
        lengthHeader: "Length",
        "value_error.not_unique": "Not unique",
        "value_error.any_str.min_length": "Must be at least {limit_value, number} {limit_value, plural, one {character} other {characters}}",
        "value_error.number.not_gt": "Must be greater than {limit_value}",
        group: "Group",
        predefinedTimersSelect: "Select a predefined timer",
        cancel: "Cancel",
        submit: "Submit",
        newGroup: "New group",
        selectGroup: "Select group",
        predefinedTimers: "Predefined timers",
        areYouSure: "Are you sure?",
        "timersCount": "{cnt, number} {cnt, plural, one {timer} other {timers}}",
        yes: "yes",
        no: "no",
        confirm: "Confirm",
        deletePredefinedTimer: "Do you really want to delete the timer, \"{name}\"?",
    },
}

export default messages;

export type TranslationKey = keyof typeof messages.en;

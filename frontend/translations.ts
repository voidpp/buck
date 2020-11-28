const messages = {
    en: {
        createTimer: "Create timer",
        startTimer: "Start timer",
        name: "Name",
        length: "Length (in seconds)",
        "value_error.not_unique": "Not unique",
        "value_error.any_str.min_length": "Must be at least {limit_value, number} {limit_value, plural, one {character} other {characters}}",
        "value_error.number.not_gt": "Must be greater than {limit_value}",
        group: "Group",
        predefinedTimersSelect: "Select a predefined timer",
        cancel: "Cancel",
        submit: "Submit",
        predefinedTimers: "Predefined timers",
        "timersCount": "{cnt, number} {cnt, plural, one {timer} other {timers}}",
    },
}

export default messages;

export type TranslationKey = keyof typeof messages.en;

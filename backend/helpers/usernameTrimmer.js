exports.transformName = (name) => {
    return name.replace(/(\w+)\s(\w+)/, (match, first, second) => {
        const secondWordCapitalized = second.charAt(0).toUpperCase() + second.slice(1);

        return first + secondWordCapitalized;
    });
}
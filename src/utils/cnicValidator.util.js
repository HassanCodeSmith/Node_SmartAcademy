export const validateCNIC = (cnic) => {
    const formatedCNIC = cnic.replace(/-/g, "");
    if (formatedCNIC.length === 13) {
        return {
            CNICStatus: true,
            formatedCNIC,
        };
    } else {
        return {
            CNICStatus: false,
            formatedCNIC,
        };
    }
};

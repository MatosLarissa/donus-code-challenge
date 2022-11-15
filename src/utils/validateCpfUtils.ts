export default class ValidateCpfUtils {
    validateCpf = (cpf: string): boolean => {
        const re = /^([0-9]{11,})$/
        return re.test(cpf);
    };
}

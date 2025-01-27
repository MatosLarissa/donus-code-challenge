export default class ValidatePasswordUtils {
    validatePassword = (cpf: string): boolean => {
        const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/
        return re.test(cpf);
    };
}

interface ValidationResult<T> {
    isValid: boolean;
    errors: Partial<Record<keyof T, string>>;
}
export default ValidationResult;
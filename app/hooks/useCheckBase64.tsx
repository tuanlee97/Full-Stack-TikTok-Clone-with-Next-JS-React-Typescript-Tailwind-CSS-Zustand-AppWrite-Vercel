const useCheckBase64 = (url: string): boolean => {
    const regex = /^data:(image\/|video\/)[a-zA-Z]*;base64,/;
    return regex.test(url);
};
export default useCheckBase64
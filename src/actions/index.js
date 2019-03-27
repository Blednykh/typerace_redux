export const select = (recordData) => {
    return{
        type: 'LOAD',
        payload: recordData
    }
};

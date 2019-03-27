export default function (state = null, action) {
    switch (action.type) {
        case 'LOAD':
        {
            return action.payload;
        }
        case 'ADD':
            return state;
        default:
            return state;

    }
}

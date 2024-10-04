import { auth, firestore } from './login';

const coletarCalendario = async () => {
    const ano = new Date().getFullYear().toString();
    try {
        const calendarioDoc = await firestore.collection(`calendario-${ano}`).doc('calendario').get();
        if (calendarioDoc.exists) {
            const data = calendarioDoc.data();
            return data.calendar.length > 0 ? data.calendar : [];
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export { coletarCalendario };
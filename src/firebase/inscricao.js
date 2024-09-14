import { auth, firestore } from './login';

const fazerInscricao = (game, nome, turma, telefone, ra) => {
    const ano = new Date().getFullYear().toString();
    try {
        const inscricaoDoc = firestore.collection(ano)
        .doc('interclasse').collection(game).doc(nome).set({
            nome,
            telefone,
            ra,
            turma,
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}


export { fazerInscricao };
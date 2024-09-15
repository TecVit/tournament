import { auth, firestore } from './login';

const formatarNome = (valor) => {
    valor = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    valor = valor.replace(/[^a-zA-Z0-9\s]/g, '');
    valor = valor.trim().replace(/\s+/g, '-');
    valor = valor.toLowerCase();
    return valor;
};

const fazerInscricao = async (game, nome, turma, email) => {
    const ano = new Date().getFullYear().toString();
    try {
        const inscricaoDoc = await firestore.collection(`interclasse-${ano}`)
        .doc(formatarNome(game)).collection('alunos').doc(nome).set({
            nome,
            email,
            turma,
        });

        const turmaDoc = await firestore.collection(ano)
        .doc('ranking').get();
        if (turmaDoc.exists) {
            let collectionsList = await turmaDoc.data().collections || {};
            if (collectionsList[turma] != 1) {
                collectionsList[turma] = 1;
                await firestore.collection(ano)
                .doc('ranking').update({
                    collections: collectionsList,
                });
            }
        } else {
            await firestore.collection(ano)
            .doc('ranking').set({
                collections: {[turma]: 1},
            });
        }

        const rankingDoc = await firestore
        .collection(`ranking-${ano}`)
        .doc(turma)
        .get();

        if (rankingDoc.exists) {
            let alunos = rankingDoc.data().alunos || [];
            let alunoIndex = alunos.findIndex(aluno => aluno[1] === nome);

            if (alunoIndex !== -1) {
                alunos[alunoIndex] = {
                    ...alunos[alunoIndex],
                    0: null,
                    1: nome,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    //[formatarNome(game)]: true,
                };
            } else {
                alunos.push({
                    0: null,
                    1: nome,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    //[formatarNome(game)]: true,
                });
            }

            await firestore
            .collection(`ranking-${ano}`)
            .doc(turma)
            .update({ alunos });
        } else {
            await firestore
            .collection(`ranking-${ano}`)
            .doc(turma).set({
                alunos: [
                    {
                        0: null,
                        1: nome,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        //[formatarNome(game)]: true,
                    },
                ],
            });
        }

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export { fazerInscricao };
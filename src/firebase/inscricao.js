import { auth, firestore } from './login';

const formatarNome = (valor) => {
    valor = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    valor = valor.replace(/[^a-zA-Z0-9\s]/g, '');
    valor = valor.trim().replace(/\s+/g, '-');
    valor = valor.toLowerCase();
    return valor;
};

function formatText(text) {
    const trimmedText = text.replace(/\s+/g, ' ').trim();
    const capitalizedText = trimmedText.replace(/\b\w/g, char => char.toUpperCase());
    return capitalizedText;
}

const fazerInscricao = async (game, nomeNormal, turma, email) => {
    const nome = formatText(nomeNormal);
    const ano = new Date().getFullYear().toString();
    try {
        const inscricaoDoc = await firestore.collection(`interclasse-${ano}`)
        .doc(formatarNome(game)).collection('alunos').doc(nome).set({
            nome,
            email,
            turma,
        });

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
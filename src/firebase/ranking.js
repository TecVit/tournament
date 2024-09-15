import { auth, firestore } from './login';

const formatarNome = (valor) => {
    valor = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    valor = valor.replace(/[^a-zA-Z0-9\s]/g, '');
    valor = valor.trim().replace(/\s+/g, '-');
    valor = valor.toLowerCase();
    return valor;
};

const coletarRankings = async () => {
    const ano = new Date().getFullYear().toString();
    try {
        let rankingTurmasList = [
            {
                0: 'Pos',
                1: 'Turma',
                2: 'p',
                3: 'v',
                4: 'd',
                5: 'pts',
            }
        ];
        let rankingAlunosList = [
            {
                0: 'Pos',
                1: 'Aluno',
                2: 'p',
                3: 'v',
                4: 'd',
                5: 'pts',
            }
        ];
        const turmasDoc = await firestore.collection(`ranking-${ano}`).get();
        if (!turmasDoc.empty) {
            let turmasList = {};
            const validando = await Promise.all(turmasDoc.docs.map( async (doc, index) => {
                const pontos = await doc.data().pontos || {};
                let alunos = await doc.data().alunos || [];
                if (Object.keys(pontos).length > 0) {
                    rankingTurmasList.push(pontos);
                } else {
                    rankingTurmasList.push({
                        0: null,
                        1: doc.id,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                    });
                }
                if (alunos.length > 0) {
                    rankingAlunosList = rankingAlunosList.concat(alunos);
                }
                return true;
            }));
            if (validando.every((val) => val === true)) {
                return { rankingTurmasList, rankingAlunosList };
            }
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export { coletarRankings };
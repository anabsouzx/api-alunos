const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");

class AlunoService{

    async findMany(page, pageSize, orderBy='id', order='asc'){
        const ordem = ['asc', 'desc'].includes(order.toLowerCase()) ? order.toLowerCase() : 'asc';

        const ordenarPor = {
            [orderBy]: ordem
        };

        const alunos = await prisma.aluno.findMany({
            skip: (page-1)*pageSize,
            take: Number(pageSize),
            orderBy: ordenarPor
        });

        const quantAlunos = await prisma.aluno.count();

        return {alunos, quantAlunos};
    }

    async create(aluno){
        const {nome, email} = aluno;
        if(!nome || !email){
            throw new AlunoInvalidoError();
        }

        const novoAluno = await prisma.aluno.create({data: aluno});

        return novoAluno;
    }
}

module.exports = new AlunoService();
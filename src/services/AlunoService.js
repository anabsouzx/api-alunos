const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");

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

    async findUnique(id){
        const aluno = await prisma.aluno.findUnique({
            where: {id: Number(id)}
        });

        if (!aluno){
            throw new AlunoNaoEncontradoError();
        }

        return aluno;
    }

    async create(aluno){
        const {nome, email} = aluno;
        if(!nome || !email){
            throw new AlunoInvalidoError();
        }

        const novoAluno = await prisma.aluno.create({data: aluno});

        return novoAluno;
    }

    async update(id, novosDados){
        if(!novosDados.nome && !novosDados.email){
            throw new AlunoInvalidoError("Nenhum dado válido foi encontrado para a atualização");
        }

        await this.findUnique(id);

        try{
            const alunoAtualizado = await prisma.aluno.update({
                where: { id: Number(id) },
                data: novosDados
            });
            return alunoAtualizado;
        }catch(error){
            if(error.code==='P2002'){
                throw new AlunoInvalidoError("E-mail já cadastrado");
            }
            throw error;
        }
    }

    async delete(id){
        await this.findUnique(id);

        await prisma.aluno.delete({
            where: { id: Number(id) }
        });
    }
}

module.exports = new AlunoService();
const alunoService = require("../services/AlunoService");

class AlunoController{
    
    async findMany(request, response){
        let {page, pageSize, orderBy, order} = request.query;
        page ||= 1;
        pageSize ||= 10;
        
        const alunos = await alunoService.findMany(page, pageSize, orderBy, order);
        return response.status(200).json({alunos});
    }

    async findUnique(request, response){
        try{
            const { id } = request.params;
            const aluno = await alunoService.findUnique(id);
            return response.status(200).json({ aluno });
        }catch(error){
            return response.status(error.statusCode || 500).json({ erro: error.message});
        }
    }

    async create(request, response){
        try{
            const aluno = await alunoService.create(request.body);
            return response.status(201).json({aluno});
        }catch(error){
            return response.status(400).json({error: error.message});
        }
    }

    async update(request, response){
        try{
            const { id } = request.params;
            const { nome, email } = request.body;

            const aluno = await alunoService.update(id, { nome, email })
            return response.status(200).json({ aluno })
        }catch(error){
            return response.status(error.statusCode || 500).json({ erro: error.message });
        }
    }
}

module.exports = new AlunoController();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de Eventos Acadêmicos no ar');
});

// Listar eventos
app.get('/eventos', async (req, res) => {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .order('id', { ascending: true });

  if (error) return res.status(500).json({ erro: error.message });
  res.json(data);
});

// Cadastrar evento
app.post('/eventos', async (req, res) => {
  const { titulo, descricao, data_evento, local } = req.body;

  if (!titulo || !data_evento || !local) {
    return res.status(400).json({ erro: 'titulo, data_evento e local são obrigatórios' });
  }

  const { data, error } = await supabase
    .from('eventos')
    .insert([{ titulo, descricao, data_evento, local }])
    .select();

  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json(data[0]);
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

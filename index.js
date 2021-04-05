const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = [ 
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "Shit",
        "number": "0909",
        "id": 5
    }
]
    
const generateId = () => {
    const id = Math.floor(Math.random() * 99999999)
    return id
}

app.get('/', (request, response) => {
    response.send('Ok')
})
  
app.get('/info', (request, response) => {
    response.send(`<div>The page has ${persons.length} people</div><div>${Date()}</div>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
  
    const filtered = persons.filter((person) => person.name === body.name)
    
    if (filtered.length > 0) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const person = {
      name: body.name,
      number: body.number,
      date: new Date(),
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(body)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.filter((person)=>{
        return person.id === id;
    })
    if (person.length > 0) {
        response.json(person)
    } 
    else {
        response.status(204).send({ error: 'No person found' })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
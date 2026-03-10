import { useState } from "react"

type Politico = {
  nome: string
  partido: string
  cargo: string
  estado: string
  cidade: string
  email: string
  telefone: string
  foto: string
}

const politicosMock: Politico[] = [
  {
    nome: "Ana Paula Silva",
    partido: "PT",
    cargo: "Deputada Federal",
    estado: "SP",
    cidade: "São Paulo",
    email: "ana.silva@congresso.gov.br",
    telefone: "(11) 3456-7890",
    foto: "https://i.pravatar.cc/150?img=32"
  },
  {
    nome: "Carlos Eduardo Santos",
    partido: "PSDB",
    cargo: "Senador",
    estado: "MG",
    cidade: "Belo Horizonte",
    email: "carlos.santos@senado.gov.br",
    telefone: "(31) 2345-6789",
    foto: "https://i.pravatar.cc/150?img=12"
  }
]

export function PoliticosPage() {

  const [busca, setBusca] = useState("")

  const filtrados = politicosMock.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-72 bg-white border-r p-6 space-y-6">

        <h2 className="text-xl font-semibold">
          Filtros
        </h2>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            Partido
          </label>
          <select className="w-full border rounded-lg p-2">
            <option>Todos</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            Estado
          </label>
          <select className="w-full border rounded-lg p-2">
            <option>Todos</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            Cargo
          </label>
          <select className="w-full border rounded-lg p-2">
            <option>Todos</option>
          </select>
        </div>

      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-10 overflow-auto">

        <h1 className="text-3xl font-bold mb-6">
          Busca de Políticos
        </h1>

        <input
          placeholder="Buscar por nome do político..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full mb-6 border rounded-xl p-3"
        />

        <p className="text-gray-600 mb-4">
          {filtrados.length} políticos encontrados
        </p>

        <div className="space-y-6">

          {filtrados.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border p-6 flex gap-6 items-center"
            >

              <img
                src={p.foto}
                className="w-20 h-20 rounded-full object-cover"
              />

              <div className="flex-1">

                <h2 className="text-xl font-semibold mb-2">
                  {p.nome}
                </h2>

                <div className="flex gap-2 mb-3">

                  <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                    {p.partido}
                  </span>

                  <span className="px-3 py-1 text-sm rounded-full bg-gray-100">
                    {p.cargo}
                  </span>

                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>📍 {p.estado}</p>
                  <p>🏙 {p.cidade}</p>
                  <p>✉ {p.email}</p>
                  <p>📞 {p.telefone}</p>
                </div>

              </div>

            </div>
          ))}

        </div>

      </main>

    </div>
  )
}
import { randomUUID } from "node:crypto"

export class databaseMemory {
  #videos = new Map()

  list() {
    console.log("Listando todos os vídeos armazenados:")
    console.log(this.#videos)
    return Array.from(this.#videos.entries()).map(([id, video]) => ({
      id,
      ...video,
    }))
  }

  create(video) {
    const videoId = randomUUID() // Gera um ID único
    console.log("Criando vídeo com ID:", videoId)
    this.#videos.set(videoId, video)
    console.log("Vídeo armazenado com sucesso. ID:", videoId)
    return videoId
  }

  update(id, video) {
    console.log("Tentando atualizar vídeo com ID:", id)
    if (!this.#videos.has(id)) {
      console.error("Erro: Vídeo com ID não encontrado:", id)
      throw new Error("Vídeo não encontrado!")
    }
    this.#videos.set(id, video)
    console.log("Vídeo atualizado com sucesso. ID:", id)
  }

  delete(id) {
    console.log("Tentando deletar vídeo com ID:", id)
    if (!this.#videos.has(id)) {
      console.error("Erro: Vídeo com ID não encontrado:", id)
      throw new Error("Vídeo não encontrado!")
    }
    this.#videos.delete(id)
    console.log("Vídeo deletado com sucesso. ID:", id)
  }
}

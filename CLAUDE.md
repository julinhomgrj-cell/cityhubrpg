# City Hub RPG

Fã-site (SPA estática de arquivo único) da comunidade City Hub RPG no Habbo Hotel BR. Tudo vive em `index.html`; dados e autenticação ficam no Supabase (projeto `vkavradhgbdrqlccvmtg`).

## Manter a aba "❓ Ajuda" atualizada

O site tem uma página interna (`#page-ajuda`, aba "Ajuda" no menu) que explica pra comunidade como cada funcionalidade do site funciona — login, perfil, empresas, cargos, feed, VIPs, painel admin, mobile, segurança.

**Sempre que uma mudança visível pro usuário for feita no site** (nova funcionalidade, mudança de comportamento, campo removido, regra de permissão alterada), atualize o conteúdo correspondente em `#page-ajuda` no mesmo commit. Não deixe a aba Ajuda ficar desatualizada em relação ao que o site realmente faz — ela é a fonte que o dono do site usa pra explicar o funcionamento pra outras pessoas.

Ao editar, siga os componentes visuais já usados nessa página (`.sec-title`, `.card`/`.card-hd`/`.card-bd`, `.g2`/`.g3`, `.alert`, tabela `.tw`) em vez de introduzir estilos novos.

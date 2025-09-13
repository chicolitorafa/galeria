# Galeria de Fotos

Uma aplicação moderna de galeria de fotos desenvolvida em React Native com Expo, oferecendo funcionalidades completas de captura, armazenamento e visualização de imagens com geolocalização.

## Funcionalidades

- **Captura de Fotos**: Interface intuitiva para tirar fotos usando a câmera do dispositivo
- **Geolocalização**: Armazenamento automático da localização onde cada foto foi tirada
- **Armazenamento Local**: Gerenciamento eficiente de arquivos no sistema local
- **Galeria Responsiva**: Visualização organizada das fotos em grade
- **Informações de Local**: Exibição de dados de localização para cada imagem
- **Navegação Fluida**: Sistema de roteamento otimizado entre telas

## Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **expo-router** - Sistema de roteamento baseado em arquivos
- **expo-camera** - API para acesso à câmera do dispositivo
- **expo-location** - Serviços de geolocalização
- **react-native-async-storage/async-storage** - Armazenamento local

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI instalado globalmente
- Dispositivos Android/iOS

## Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/galeria-fotos.git
cd galeria-fotos
```

2. **Instale as dependências:**
```bash
npm install
# ou
yarn install
```

3. **Inicie o projeto:**
```bash
npx expo start
```

4. **Execute no dispositivo:**
   - Escaneie o QR code com o app Expo Go (Android/iOS)
   - Ou pressione `a` para Android emulator
   - Ou pressione `i` para iOS simulator

## Permissões Necessárias

A aplicação requer as seguintes permissões:

- **Câmera**: Para capturar fotos
- **Localização**: Para adicionar coordenadas às imagens

As permissões são solicitadas automaticamente durante o primeiro uso.

## Como Usar

1. **Tirar Fotos**: Navegue até a aba "Câmera" e toque no botão de captura
2. **Ver Galeria**: Acesse a aba "Galeria" para visualizar todas as fotos
3. **Detalhes**: Toque em qualquer foto para ver informações detalhadas e localização
4. **Organização**: As fotos são automaticamente organizadas por data

## Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/chicolitorafa/galeria/issues) descrevendo:

- Descrição do problema
- Passos para reproduzir
- Comportamento esperado
- Screenshots (se aplicável)
- Informações do dispositivo/sistema

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

**Desenvolvido com usando React Native e Expo**

Para mais informações, consulte a [documentação do Expo](https://docs.expo.dev/).

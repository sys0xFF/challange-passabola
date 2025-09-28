// Hook universal de desenvolvimento para todas as páginas
import { useEffect } from 'react'

export const useDevAutoFill = () => {
  useEffect(() => {
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // Temporariamente removido: if (process.env.NODE_ENV === 'development') {
      console.log('DevAutoFill carregado');
      
      // Gerador de dados aleatórios
      const gerarDadosAleatorios = () => {
        const nomes = ["Ana", "Beatriz", "Carolina", "Débora", "Eduarda", "Fernanda", "Gabriela", "Helena", "Isabela", "Juliana", "Karina", "Larissa", "Mariana", "Natália", "Olívia", "Patricia", "Rafaela", "Sofia", "Tatiana", "Valentina"];
        const sobrenomes = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Ribeiro", "Carvalho", "Almeida", "Lopes", "Monteiro", "Araújo", "Cardoso", "Martins", "Rocha", "Dias"];
        const bairros = ["Vila Madalena", "Pinheiros", "Moema", "Jardins", "Vila Olímpia", "Itaim Bibi", "Bela Vista", "Centro", "Perdizes", "Santana", "Brooklin", "Campo Belo", "Tatuapé", "Liberdade", "Aclimação"];
        const posicoes = ["goleira", "zagueira", "lateral", "volante", "meia", "atacante"];
        const jaParticipou = ["sim", "nao"];

        const gerarNome = () => {
          const nome = nomes[Math.floor(Math.random() * nomes.length)];
          const sobrenome1 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
          const sobrenome2 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
          return `${nome} ${sobrenome1} ${sobrenome2}`;
        };

        const gerarEmail = (nome: string) => {
          const nomeEmail = nome.toLowerCase().replace(/\s+/g, '.').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return `${nomeEmail}@email.com`;
        };

        const gerarTelefone = () => {
          const ddd = "11";
          const num = Math.floor(Math.random() * 900000000) + 100000000;
          return `(${ddd}) 9${num.toString().substring(0,4)}-${num.toString().substring(4,8)}`;
        };

        const gerarIdade = () => String(Math.floor(Math.random() * 15) + 18); // 18 a 32 anos

        const gerarBairro = () => `São Paulo - ${bairros[Math.floor(Math.random() * bairros.length)]}`;

        const gerarPosicao = () => posicoes[Math.floor(Math.random() * posicoes.length)];

        const gerarParticipacao = () => jaParticipou[Math.floor(Math.random() * jaParticipou.length)];

        return {
          gerarNome,
          gerarEmail,
          gerarTelefone,
          gerarIdade,
          gerarBairro,
          gerarPosicao,
          gerarParticipacao
        };
      };

      const generator = gerarDadosAleatorios();

      // Função para gerar dados de equipe completos
      const gerarDadosEquipe = () => {
        const nomeCapitao = generator.gerarNome();
        const jogadoras = [];
        
        for (let i = 0; i < 7; i++) {
          const nome = generator.gerarNome();
          jogadoras.push({
            nomeCompleto: nome,
            email: generator.gerarEmail(nome),
            telefone: generator.gerarTelefone(),
            idade: generator.gerarIdade(),
            cidadeBairro: generator.gerarBairro(),
            posicao: generator.gerarPosicao(),
            jaParticipou: generator.gerarParticipacao()
          });
        }

        return {
          nomeTime: `${generator.gerarNome().split(' ')[0]} FC`,
          nomeCapitao: nomeCapitao.split(' ')[0] + " " + nomeCapitao.split(' ')[1],
          capitao: {
            nomeCompleto: nomeCapitao,
            email: generator.gerarEmail(nomeCapitao),
            telefone: generator.gerarTelefone(),
            idade: generator.gerarIdade(),
            cidadeBairro: generator.gerarBairro(),
            posicao: generator.gerarPosicao(),
            jaParticipou: generator.gerarParticipacao()
          },
          jogadoras: jogadoras
        };
      };

      // Dados universais
      const dadosUniversais = {
        // Dados para cadastro
        cadastro: {
          individual: (() => {
            const nome = generator.gerarNome();
            return {
              nomeCompleto: nome,
              email: generator.gerarEmail(nome),
              telefone: generator.gerarTelefone(),
              idade: generator.gerarIdade(),
              cidadeBairro: generator.gerarBairro(),
              posicao: generator.gerarPosicao(),
              jaParticipou: generator.gerarParticipacao()
            };
          })(),
          equipe: gerarDadosEquipe()
        },

        // Dados para contato
        contato: {
          nome: "Juliana Santos",
          email: "juliana.santos@email.com",
          telefone: "(11) 98765-4321",
          assunto: "inscricoes",
          mensagem: "Olá! Gostaria de saber mais informações sobre as inscrições para a Copa Passa Bola 2025. Quando começam as inscrições e quais são os requisitos para participar? Aguardo retorno. Obrigada!"
        },

        // Dados para checkout
        checkout: {
          nomeCompleto: "Carolina Oliveira Santos",
          email: "carolina.oliveira@email.com",
          telefone: "(11) 97777-5555",
          cpf: "123.456.789-00",
          cep: "01310-100",
          endereco: "Avenida Paulista, 1000",
          numero: "1000",
          complemento: "Apto 101",
          bairro: "Bela Vista",
          cidade: "São Paulo",
          estado: "SP",
          cartao: {
            numero: "1234 5678 9012 3456",
            nome: "Carolina O Santos",
            validade: "12/27",
            cvv: "123"
          }
        },

        // Dados para doação
        doacao: {
          nomeCompleto: "Beatriz Ferreira Lima",
          email: "beatriz.ferreira@email.com",
          telefone: "(11) 96666-3333",
          cpf: "987.654.321-00",
          valor: 100
        },

        // Dados para voluntária
        voluntaria: {
          nomeCompleto: "Gabriela Costa Silva",
          idade: "26",
          email: "gabriela.costa@email.com",
          telefone: "(11) 95555-2222",
          cidadeBairro: "São Paulo - Moema",
          profissao: "Designer Gráfica",
          experienciaAnterior: "Voluntária em eventos esportivos da faculdade e em ONGs locais. Tenho experiência com organização de eventos e trabalho em equipe.",
          motivacao: "Quero contribuir com o futebol feminino e ajudar no crescimento do esporte. Acredito que o esporte transforma vidas e quero fazer parte dessa mudança.",
          disponibilidadeDias: ["sabado", "domingo"],
          disponibilidadeHorarios: ["manha", "tarde"],
          temTransporte: "sim",
          referencias: "Ana Silva - Coordenadora de Eventos - (11) 98888-7777",
          antecedentes: "nao",
          observacoes: "Tenho conhecimento em design gráfico e posso ajudar com materiais visuais e comunicação digital."
        }
      };

      // Utilitários
      const utils = {
        // Detectar página atual
        detectarPagina: () => {
          const path = window.location.pathname.toLowerCase();
          if (path.includes('cadastro')) return 'cadastro';
          if (path.includes('carrinho')) return 'carrinho';
          if (path.includes('checkout')) return 'checkout';
          if (path.includes('contato')) return 'contato';
          if (path.includes('doacao')) return 'doacao';
          if (path.includes('loja')) return 'loja';
          if (path.includes('voluntaria')) return 'voluntaria';
          return 'home';
        },

        // Aguardar
        aguardar: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

        // Preencher input React
        setReactInput: (element: any, value: string) => {
          if (!element) return false;
          
          // Verificar se é um input, textarea ou select
          if (element instanceof HTMLInputElement || 
              element instanceof HTMLTextAreaElement || 
              element instanceof HTMLSelectElement) {
            
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              element.constructor.prototype, "value"
            )?.set;
            
            if (nativeInputValueSetter) {
              nativeInputValueSetter.call(element, value);
            } else {
              // Fallback direto
              element.value = value;
            }
            
            const inputEvent = new Event('input', { bubbles: true });
            element.dispatchEvent(inputEvent);
            
            const changeEvent = new Event('change', { bubbles: true });
            element.dispatchEvent(changeEvent);
            
            return true;
          }
          
          // Se não for um elemento de input, tentar definir value diretamente
          try {
            element.value = value;
            return true;
          } catch (e) {
            console.warn(`Não foi possível definir valor para elemento:`, element, e);
            return false;
          }
        },

        // Preencher por ID
        preencherPorId: (id: string, valor: string) => {
          const elemento = document.getElementById(id);
          if (elemento) {
            utils.setReactInput(elemento, valor);
            console.log(`✅ ${id}: ${valor}`);
            return true;
          }
          return false;
        },

        // Clicar em elemento
        clicar: (seletor: string) => {
          // Suporte para seletores com :contains
          let elemento: Element | null = null;
          if (seletor.includes(':contains(')) {
            const texto = seletor.match(/:contains\("([^"]+)"\)/)?.[1];
            if (texto) {
              const elementos = Array.from(document.querySelectorAll(seletor.split(':contains')[0] || '*'));
              elemento = elementos.find(el => el.textContent?.includes(texto)) || null;
            }
          } else {
            elemento = document.querySelector(seletor);
          }
          
          if (elemento && 'click' in elemento) {
            (elemento as HTMLElement).click();
            console.log(`✅ Clicado: ${seletor}`);
            return true;
          }
          return false;
        },

        // Selecionar radio
        selecionarRadio: (valor: string) => {
          const radio = document.querySelector(`input[type="radio"][value="${valor}"]`);
          if (radio && 'click' in radio) {
            (radio as HTMLElement).click();
            console.log(`✅ Radio selecionado: ${valor}`);
            return true;
          }
          return false;
        },

        // Marcar checkbox
        marcarCheckbox: (seletor: string, marcar = true) => {
          const checkbox = document.querySelector(seletor) as HTMLInputElement;
          if (checkbox && checkbox.checked !== marcar) {
            checkbox.click();
            console.log(`✅ Checkbox ${marcar ? 'marcado' : 'desmarcado'}: ${seletor}`);
            return true;
          }
          return false;
        }
      };

      // Sistema global
      (window as any).PassaBolaTest = {
        // Detecção automática e preenchimento
        auto: () => {
          const pagina = utils.detectarPagina();
          console.log(`Pagina detectada: ${pagina}`);
          
          switch (pagina) {
            case 'cadastro':
              console.log("Opcoes disponiveis:");
              console.log("- test.cadastroIndividual() (para cadastro individual)");
              console.log("- test.cadastroEquipeCompleto() (para cadastro de equipe - DADOS ALEATÓRIOS)");
              break;
            case 'contato':
              (window as any).PassaBolaTest.contato();
              break;
            case 'checkout':
              (window as any).PassaBolaTest.checkout();
              break;
            case 'doacao':
              (window as any).PassaBolaTest.doacao();
              break;
            case 'voluntaria':
              (window as any).PassaBolaTest.voluntaria();
              break;
            case 'loja':
              (window as any).PassaBolaTest.loja();
              break;
            default:
              console.log("Pagina nao suportada para preenchimento automatico");
          }
        },

        // CADASTRO INDIVIDUAL
        cadastroIndividual: async () => {
          console.log("Preenchendo cadastro individual completo...");
          
          // Tentar selecionar individual primeiro
          utils.clicar('button:contains("INDIVIDUAL")');
          await utils.aguardar(1000);
          
          const dados = dadosUniversais.cadastro.individual;
          
          // ETAPA 1: Dados básicos
          console.log("ETAPA 1: Preenchendo dados basicos...");
          utils.preencherPorId('nomeCompleto', dados.nomeCompleto);
          utils.preencherPorId('email', dados.email);
          utils.preencherPorId('telefone', dados.telefone);
          
          // Aguardar e continuar para os dados complementares
          setTimeout(() => {
            console.log("Continuando para dados complementares...");
            utils.clicar('button:contains("CONTINUAR")');
            
            setTimeout(() => {
              console.log("ETAPA 2: Preenchendo dados complementares...");
              
              // Campos complementares do cadastro individual
              utils.preencherPorId('idade', dados.idade);
              utils.preencherPorId('cidadeBairro', dados.cidadeBairro);
              
              // Posição (Select)
              setTimeout(() => {
                const selectTrigger = document.querySelector('[data-placeholder*="Selecione sua posição"]') ||
                                    document.querySelector('button:has([placeholder*="posição"])') ||
                                    Array.from(document.querySelectorAll('button')).find(btn => 
                                      btn.textContent?.includes('Selecione sua posição')
                                    );
                
                if (selectTrigger && selectTrigger instanceof HTMLElement) {
                  selectTrigger.click();
                  
                  setTimeout(() => {
                    const opcao = document.querySelector(`[data-value="${dados.posicao}"]`) ||
                                document.querySelector(`[value="${dados.posicao}"]`) ||
                                Array.from(document.querySelectorAll('[role="option"]')).find(opt => 
                                  opt.textContent?.toLowerCase().includes(dados.posicao)
                                );
                    
                    if (opcao && opcao instanceof HTMLElement) {
                      opcao.click();
                      console.log(`Posicao selecionada: ${dados.posicao}`);
                    }
                  }, 300);
                }
              }, 500);
              
              // Radio button "Já participou" (IDs específicos do individual: sim e nao)
              setTimeout(() => {
                console.log("Marcando participacao anterior...");
                const radioId = dados.jaParticipou === "sim" ? "sim" : "nao";
                const radio = document.getElementById(radioId);
                
                if (radio && radio instanceof HTMLElement) {
                  radio.click();
                  console.log(`Participacao marcada: ${dados.jaParticipou}`);
                } else {
                  console.log(`AVISO: Radio button nao encontrado: ${radioId}`);
                }
              }, 1000);
              
              console.log("Cadastro individual completo finalizado!");
            }, 1000);
          }, 2000);
        },

        // CADASTRO EQUIPE COMPLETO
        cadastroEquipeCompleto: async () => {
          console.log("Iniciando cadastro de equipe completo com dados aleatórios...");
          
          // Gerar novos dados aleatórios para cada execução
          const dados = gerarDadosEquipe();
          console.log("Dados gerados:", dados);
          
          // Primeiro selecionar TIME
          utils.clicar('button:contains("TIME")');
          await utils.aguardar(1000);
          
          // ETAPA 1: Dados básicos da equipe e capitã
          console.log("ETAPA 1: Preenchendo dados básicos...");
          utils.preencherPorId('nomeTime', dados.nomeTime);
          utils.preencherPorId('nomeCapitao', dados.nomeCapitao);
          utils.preencherPorId('nomeCompleto', dados.capitao.nomeCompleto);
          utils.preencherPorId('email', dados.capitao.email);
          utils.preencherPorId('telefone', dados.capitao.telefone);
          
          // Aguardar e continuar automaticamente
          setTimeout(() => {
            console.log("Continuando automaticamente para etapa 2...");
            utils.clicar('button:contains("CONTINUAR")');
            
            setTimeout(() => {
              console.log("ETAPA 2: Preenchendo dados complementares da capitã...");
              
              // Campos adicionais da capitã na segunda etapa
              utils.preencherPorId('captainIdade', dados.capitao.idade);
              utils.preencherPorId('captainCidadeBairro', dados.capitao.cidadeBairro);
              
              // Posição da capitã (Select)
              setTimeout(() => {
                const selectTrigger = document.querySelector('[data-placeholder="Posição da capitã"]') ||
                                    document.querySelector('button:has([placeholder*="Posição da capitã"])') ||
                                    Array.from(document.querySelectorAll('button')).find(btn => 
                                      btn.textContent?.includes('Posição da capitã') || 
                                      btn.textContent?.includes('Selecione')
                                    );
                
                if (selectTrigger && selectTrigger instanceof HTMLElement) {
                  selectTrigger.click();
                  
                  setTimeout(() => {
                    const opcao = document.querySelector(`[data-value="${dados.capitao.posicao}"]`) ||
                                document.querySelector(`[value="${dados.capitao.posicao}"]`) ||
                                Array.from(document.querySelectorAll('[role="option"]')).find(opt => 
                                  opt.textContent?.toLowerCase().includes(dados.capitao.posicao)
                                );
                    
                    if (opcao && opcao instanceof HTMLElement) {
                      opcao.click();
                    }
                  }, 300);
                }
              }, 500);
              
              // Radio button "Já participou" da capitã
              setTimeout(() => {
                const radioId = dados.capitao.jaParticipou === "sim" ? "captain-sim" : "captain-nao";
                const radio = document.getElementById(radioId);
                
                if (radio && radio instanceof HTMLElement) {
                  radio.click();
                }
              }, 1000);
              
              // Aguardar e ir para a próxima etapa
              setTimeout(() => {
                console.log("Continuando para etapa 3 - dados das jogadoras...");
                utils.clicar('button:contains("CONTINUAR")');
                
                setTimeout(() => {
                  console.log("ETAPA 3: Preenchendo dados das 7 jogadoras...");
                  
                  // Aguardar a página carregar e encontrar os cards das jogadoras
                  const preencherJogadoras = () => {
                    const jogadoraCards = Array.from(document.querySelectorAll('.border'))
                      .filter(card => {
                        const texto = card.textContent || '';
                        return texto.includes('Jogadora') || texto.includes('Nome completo');
                      });
                    
                    console.log(`Cards de jogadoras encontrados: ${jogadoraCards.length}`);
                    
                    if (jogadoraCards.length === 0) {
                      console.log("Nenhum card encontrado, tentando novamente em 1s...");
                      setTimeout(preencherJogadoras, 1000);
                      return;
                    }
                    
                    dados.jogadoras.forEach((jogadora, index) => {
                      setTimeout(() => {
                        if (index < jogadoraCards.length) {
                          const card = jogadoraCards[index];
                          console.log(`Preenchendo jogadora ${index + 1}: ${jogadora.nomeCompleto}`);
                          
                          // Buscar inputs com maior flexibilidade
                          const inputs = card.querySelectorAll('input');
                          console.log(`Inputs encontrados no card ${index + 1}: ${inputs.length}`);
                          
                          inputs.forEach((input, inputIndex) => {
                            if (input instanceof HTMLInputElement) {
                              const placeholder = input.getAttribute('placeholder') || '';
                              const type = input.getAttribute('type') || '';
                              console.log(`Input ${inputIndex}: placeholder="${placeholder}", type="${type}"`);
                              
                              // Nome completo
                              if (placeholder.toLowerCase().includes('nome') && !input.value) {
                                utils.setReactInput(input, jogadora.nomeCompleto);
                                console.log(`Nome preenchido: ${jogadora.nomeCompleto}`);
                              }
                              // Email
                              else if (type === 'email' || placeholder.toLowerCase().includes('email')) {
                                utils.setReactInput(input, jogadora.email);
                                console.log(`Email preenchido: ${jogadora.email}`);
                              }
                              // Telefone/WhatsApp
                              else if (placeholder.includes('99999') || placeholder.toLowerCase().includes('whatsapp') || placeholder.includes('(11)')) {
                                utils.setReactInput(input, jogadora.telefone);
                                console.log(`Telefone preenchido: ${jogadora.telefone}`);
                              }
                              // Idade
                              else if (placeholder.toLowerCase().includes('idade')) {
                                utils.setReactInput(input, jogadora.idade);
                                console.log(`Idade preenchida: ${jogadora.idade}`);
                              }
                              // Cidade/Bairro
                              else if (placeholder.toLowerCase().includes('cidade') || placeholder.toLowerCase().includes('bairro')) {
                                utils.setReactInput(input, jogadora.cidadeBairro);
                                console.log(`Cidade/Bairro preenchido: ${jogadora.cidadeBairro}`);
                              }
                            }
                          });
                          
                          // Posição da jogadora (Select) - com delay maior
                          setTimeout(() => {
                            const selectButton = card.querySelector('button[role="combobox"]') ||
                                               Array.from(card.querySelectorAll('button')).find(btn => 
                                                 btn.textContent?.includes('Selecione a posição') ||
                                                 btn.textContent?.includes('Selecione')
                                               );
                            
                            if (selectButton && selectButton instanceof HTMLElement) {
                              selectButton.click();
                              
                              setTimeout(() => {
                                const opcaoPosicao = document.querySelector(`[data-value="${jogadora.posicao}"]`) ||
                                                   Array.from(document.querySelectorAll('[role="option"]')).find(opt => 
                                                     opt.textContent?.toLowerCase().includes(jogadora.posicao)
                                                   );
                                
                                if (opcaoPosicao && opcaoPosicao instanceof HTMLElement) {
                                  opcaoPosicao.click();
                                  console.log(`Posição selecionada para jogadora ${index + 1}: ${jogadora.posicao}`);
                                }
                              }, 300);
                            }
                          }, 500);
                          
                          // Radio button "Já participou" da jogadora - com delay ainda maior
                          setTimeout(() => {
                            const jogadoraId = index + 1;
                            const radioSim = document.getElementById(`player-${jogadoraId}-sim`);
                            const radioNao = document.getElementById(`player-${jogadoraId}-nao`);
                            
                            const valorDesejado = jogadora.jaParticipou;
                            
                            if (valorDesejado === 'sim' && radioSim && radioSim instanceof HTMLElement) {
                              radioSim.click();
                              console.log(`Radio SIM marcado para jogadora ${index + 1}`);
                            } else if (valorDesejado === 'nao' && radioNao && radioNao instanceof HTMLElement) {
                              radioNao.click();
                              console.log(`Radio NAO marcado para jogadora ${index + 1}`);
                            } else {
                              console.log(`AVISO: Radio button não encontrado para jogadora ${index + 1}. Tentando fallback...`);
                              
                              // Fallback: buscar qualquer radio button no card
                              const radiosNoCard = card.querySelectorAll('input[type="radio"]');
                              if (radiosNoCard.length >= 2) {
                                const radioParaClicar = valorDesejado === 'sim' ? radiosNoCard[0] : radiosNoCard[1];
                                if (radioParaClicar instanceof HTMLElement) {
                                  radioParaClicar.click();
                                  console.log(`Fallback: Radio ${valorDesejado} marcado para jogadora ${index + 1}`);
                                }
                              }
                            }
                          }, 1000);
                        }
                      }, index * 1200); // Aumentei o delay entre jogadoras
                    });
                  };
                  
                  // Iniciar preenchimento das jogadoras
                  setTimeout(preencherJogadoras, 500);
                  
                }, 1000);
              }, 1500);
            }, 1000);
          }, 2000);
        },
        contato: () => {
          console.log("🎯 Preenchendo formulário de contato...");
          const dados = dadosUniversais.contato;
          
          utils.preencherPorId('nome', dados.nome);
          utils.preencherPorId('email', dados.email);
          utils.preencherPorId('telefone', dados.telefone);
          
          // Assunto
          setTimeout(() => {
            const select = document.querySelector('select') || document.querySelector('[role="combobox"]');
            if (select) {
              select.click();
              setTimeout(() => {
                utils.clicar(`[data-value="${dados.assunto}"]`) || utils.clicar(`option[value="${dados.assunto}"]`);
              }, 300);
            }
          }, 500);
          
          // Mensagem
          const mensagem = document.querySelector('textarea') || document.getElementById('mensagem');
          if (mensagem) {
            utils.setReactInput(mensagem, dados.mensagem);
          }
          
          console.log("✅ Formulário de contato preenchido!");
        },

        // CHECKOUT
        checkout: () => {
          console.log("🎯 Preenchendo dados de checkout...");
          const dados = dadosUniversais.checkout;
          
          utils.preencherPorId('nomeCompleto', dados.nomeCompleto);
          utils.preencherPorId('email', dados.email);
          utils.preencherPorId('telefone', dados.telefone);
          utils.preencherPorId('cpf', dados.cpf);
          utils.preencherPorId('cep', dados.cep);
          utils.preencherPorId('endereco', dados.endereco);
          utils.preencherPorId('numero', dados.numero);
          utils.preencherPorId('complemento', dados.complemento);
          utils.preencherPorId('bairro', dados.bairro);
          utils.preencherPorId('cidade', dados.cidade);
          utils.preencherPorId('estado', dados.estado);
          
          console.log("✅ Dados de checkout preenchidos!");
        },

        // DOAÇÃO
        doacao: () => {
          console.log("🎯 Preenchendo formulário de doação...");
          const dados = dadosUniversais.doacao;
          
          // Selecionar valor
          utils.clicar(`button:contains("R$ ${dados.valor}")`);
          
          setTimeout(() => {
            // Doação identificada
            utils.clicar('input[value="identified"]');
            
            setTimeout(() => {
              utils.preencherPorId('nomeCompleto', dados.nomeCompleto);
              utils.preencherPorId('email', dados.email);
              utils.preencherPorId('telefone', dados.telefone);
              utils.preencherPorId('cpf', dados.cpf);
            }, 500);
          }, 500);
          
          console.log("✅ Formulário de doação preenchido!");
        },

        // FUNÇÃO DEBUG PARA DIAS
        debugDias: () => {
          console.log("🔍 === DEBUG DETALHADO DOS DIAS ===");
          
          // 1. Verificar se estamos na página correta
          const currentUrl = window.location.pathname;
          console.log(`URL atual: ${currentUrl}`);
          
          // 2. Verificar se estamos no step correto
          const stepElements = document.querySelectorAll('[class*="step"]');
          console.log(`Elementos de step encontrados: ${stepElements.length}`);
          
          // 3. Verificar o texto "Disponibilidade" na página
          const disponibilidadeTexto = document.querySelector('h3');
          if (disponibilidadeTexto) {
            console.log(`Texto do h3: "${disponibilidadeTexto.textContent}"`);
          }
          
          // 4. Procurar todos os checkboxes
          const todosCheckboxes = document.querySelectorAll('input[type="checkbox"]');
          console.log(`Total de checkboxes: ${todosCheckboxes.length}`);
          
          // 5. Procurar especificamente por IDs que começam com "dia-"
          const diasCheckboxes = document.querySelectorAll('input[id^="dia-"]');
          console.log(`Checkboxes com ID começando em "dia-": ${diasCheckboxes.length}`);
          
          if (diasCheckboxes.length === 0) {
            console.log("❌ NENHUM checkbox de dia encontrado!");
            console.log("Vamos verificar se os elementos existem mas com IDs diferentes...");
            
            // Procurar labels que contenham nomes de dias
            const labels = document.querySelectorAll('label');
            console.log(`Total de labels: ${labels.length}`);
            
            const diasNomes = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
            labels.forEach((label, i) => {
              const texto = label.textContent?.trim();
              if (diasNomes.includes(texto)) {
                const forAttr = label.getAttribute('for');
                console.log(`Label "${texto}" aponta para ID: "${forAttr}"`);
                
                const checkbox = forAttr ? document.getElementById(forAttr) : null;
                if (checkbox) {
                  console.log(`  ✅ Checkbox encontrado: ${checkbox.tagName}, ID: ${checkbox.id}`);
                } else {
                  console.log(`  ❌ Checkbox não encontrado para "${forAttr}"`);
                }
              }
            });
          } else {
            console.log("✅ Checkboxes de dias encontrados:");
            diasCheckboxes.forEach((cb, i) => {
              console.log(`  ${i + 1}. ID: "${cb.id}"`);
            });
          }
        },

        // VOLUNTÁRIA
        voluntaria: () => {
          console.log("Preenchendo cadastro de voluntária...");
          const dados = dadosUniversais.voluntaria;
          
          // Primeira etapa: selecionar áreas (aguardar um pouco)
          setTimeout(() => {
            console.log("Selecionando áreas de interesse...");
            
            // As áreas são cards clicáveis, não checkboxes
            const areasParaSelecionar = ['comunicacao', 'organizacao', 'recepcao'];
            
            areasParaSelecionar.forEach(areaId => {
              // Procurar o card da área por diferentes métodos
              let areaEncontrada = false;
              
              // Tentar encontrar por conteúdo de texto nos cards
              const cards = document.querySelectorAll('[role="button"], .cursor-pointer, .card');
              for (const card of cards) {
                const texto = card.textContent?.toLowerCase() || '';
                if ((areaId === 'comunicacao' && (texto.includes('comunicação') || texto.includes('marketing'))) ||
                    (areaId === 'organizacao' && (texto.includes('organização') || texto.includes('eventos'))) ||
                    (areaId === 'recepcao' && (texto.includes('recepção') || texto.includes('apoio')))) {
                  if (card instanceof HTMLElement) {
                    card.click();
                    console.log(`Área selecionada: ${areaId}`);
                    areaEncontrada = true;
                    break;
                  }
                }
              }
              
              if (!areaEncontrada) {
                console.log(`ERRO: Área não encontrada: ${areaId}`);
              }
            });
          }, 500);
          
          // Segunda etapa: dados pessoais (aguardar mais tempo)
          setTimeout(() => {
            console.log("Preenchendo dados pessoais...");
            
            // Mapear campos com verificações robustas
            const campos = [
              { id: 'nomeCompleto', valor: dados.nomeCompleto },
              { id: 'idade', valor: dados.idade },
              { id: 'email', valor: dados.email },
              { id: 'telefone', valor: dados.telefone },
              { id: 'cidadeBairro', valor: dados.cidadeBairro },
              { id: 'profissao', valor: dados.profissao }
            ];
            
            campos.forEach(campo => {
              try {
                let elemento = document.getElementById(campo.id);
                if (!elemento) {
                  elemento = document.querySelector(`input[name="${campo.id}"]`);
                }
                
                if (elemento && (elemento instanceof HTMLInputElement || 
                                elemento instanceof HTMLTextAreaElement)) {
                  if (utils.setReactInput(elemento, campo.valor)) {
                    console.log(`✅ ${campo.id}: ${campo.valor}`);
                  }
                } else {
                  console.warn(`⚠️ Campo não encontrado: ${campo.id}`);
                }
              } catch (e) {
                console.error(`❌ Erro ao preencher ${campo.id}:`, e);
              }
            });
            
            // Terceira etapa: Textareas
            setTimeout(() => {
              console.log("📝 Preenchendo textareas...");
              const camposTexto = [
                { id: 'experienciaAnterior', valor: dados.experienciaAnterior },
                { id: 'motivacao', valor: dados.motivacao },
                { id: 'referencias', valor: dados.referencias },
                { id: 'observacoes', valor: dados.observacoes }
              ];
              
              camposTexto.forEach(campo => {
                try {
                  const elemento = document.getElementById(campo.id);
                  if (elemento && elemento instanceof HTMLTextAreaElement) {
                    if (utils.setReactInput(elemento, campo.valor)) {
                      console.log(`✅ ${campo.id}: ${campo.valor.substring(0, 50)}...`);
                    }
                  } else {
                    console.warn(`⚠️ Textarea não encontrado: ${campo.id}`);
                  }
                } catch (e) {
                  console.error(`❌ Erro ao preencher textarea ${campo.id}:`, e);
                }
              });
              
              // Quarta etapa: Checkboxes de disponibilidade
              setTimeout(() => {
                console.log("� Selecionando disponibilidade...");
                
                // Dias da semana - corrigido para shadcn/ui checkboxes (que são buttons)
                const diasParaSelecionar = ["Segunda", "Terça", "Quinta", "Sábado"];
                diasParaSelecionar.forEach(dia => {
                  console.log(`Tentando selecionar dia: ${dia}`);
                  
                  // Os checkboxes do shadcn/ui são elementos button, não input
                  const checkbox = document.getElementById(`dia-${dia}`);
                  
                  if (checkbox) {
                    console.log(`✅ Elemento encontrado: ${checkbox.tagName} com ID: ${checkbox.id}`);
                    
                    // Para elementos button do shadcn/ui, usar click() diretamente
                    checkbox.click();
                    console.log(`✅ Dia selecionado: ${dia}`);
                  } else {
                    console.warn(`⚠️ Checkbox do dia não encontrado: dia-${dia}`);
                  }
                });
                
                // Horários - os IDs têm caracteres especiais, usar querySelector
                const horariosParaSelecionar = [
                  { texto: "Manhã (8h-12h)", id: "horario-Manhã (8h-12h)" },
                  { texto: "Tarde (12h-18h)", id: "horario-Tarde (12h-18h)" }
                ];
                
                horariosParaSelecionar.forEach(horario => {
                  // Usar querySelector com escape ou busca por atributo
                  let checkbox = document.querySelector(`[id="horario-${horario.texto}"]`) ||
                                document.querySelector(`input[type="checkbox"][id*="${horario.texto}"]`);
                  
                  if (checkbox && checkbox instanceof HTMLElement) {
                    checkbox.click();
                    console.log(`Horario selecionado: ${horario.texto}`);
                  } else {
                    console.log(`ERRO: Checkbox do horario não encontrado: ${horario.texto}`);
                    
                    // Debug: mostrar todos os checkboxes de horário encontrados
                    const todosCheckboxes = document.querySelectorAll('input[type="checkbox"]');
                    console.log("Checkboxes encontrados:");
                    todosCheckboxes.forEach((cb, i) => {
                      console.log(`${i}: id="${cb.id}", name="${cb.getAttribute('name')}"`);
                    });
                  }
                });
                
                // Quinta etapa: Radio buttons
                setTimeout(() => {
                  console.log("Selecionando radio buttons...");
                  
                  // Transporte próprio
                  const transporteRadio = document.getElementById('transporte-sim');
                  if (transporteRadio) {
                    transporteRadio.click();
                    console.log("Transporte: Sim");
                  } else {
                    console.log("ERRO: Radio button de transporte não encontrado");
                  }
                  
                  // Antecedentes criminais
                  const antecedenteRadio = document.getElementById('antecedentes-nao');
                  if (antecedenteRadio) {
                    antecedenteRadio.click();
                    console.log("Antecedentes: Não");
                  } else {
                    console.log("ERRO: Radio button de antecedentes não encontrado");
                  }
                  
                  // Sexta etapa: Checkboxes finais (termos)
                  setTimeout(() => {
                    console.log("Marcando checkboxes de termos...");
                    
                    // Notificações
                    const checkboxNotifications = document.getElementById('notifications');
                    if (checkboxNotifications) {
                      checkboxNotifications.click();
                      console.log("Notificações marcadas");
                    }
                    
                    // Termos
                    const checkboxTerms = document.getElementById('terms');
                    if (checkboxTerms) {
                      checkboxTerms.click();
                      console.log("Termos aceitos");
                    }
                    
                    console.log("Formulário de voluntária preenchido completamente!");
                  }, 500);
                }, 500);
              }, 1000);
            }, 1000);
          }, 1500);
        },

        // LOJA
        loja: () => {
          console.log("🎯 Adicionando produtos ao carrinho...");
          
          const addButtons = document.querySelectorAll('button');
          const botoes = Array.from(addButtons).filter(btn => 
            btn.textContent?.includes('Adicionar') || btn.textContent?.includes('ADD')
          );
          
          // Adicionar alguns produtos
          botoes.slice(0, 3).forEach((btn, index) => {
            setTimeout(() => {
              btn.click();
              console.log(`✅ Produto ${index + 1} adicionado`);
            }, index * 1000);
          });
        },

        // UTILITÁRIOS GERAIS
        continuar: () => {
          utils.clicar('button:contains("CONTINUAR")');
        },

        termos: () => {
          const selectors = ['#terms', '#acceptTerms', 'input[type="checkbox"]'];
          selectors.forEach(sel => utils.marcarCheckbox(sel, true));
          console.log("✅ Termos aceitos!");
        },

        finalizar: () => {
          const botoes = ['FINALIZAR', 'ENVIAR', 'CONFIRMAR'];
          botoes.forEach(texto => utils.clicar(`button:contains("${texto}")`));
        },

        cartao: () => {
          console.log("💳 Preenchendo dados do cartão...");
          const dados = dadosUniversais.checkout.cartao;
          
          // Primeiro selecionar pagamento por cartão
          utils.clicar('input[value="card"]') || utils.clicar('[data-payment="card"]');
          
          setTimeout(() => {
            // Procurar campos do cartão com diferentes seletores
            const campos = [
              { ids: ['cardNumber', 'numeroCartao'], valor: dados.numero, nome: 'número' },
              { ids: ['cardName', 'nomeCartao', 'cardHolder'], valor: dados.nome, nome: 'nome' },
              { ids: ['cardExpiry', 'validade', 'vencimento'], valor: dados.validade, nome: 'validade' },
              { ids: ['cardCvv', 'cvv', 'codigo'], valor: dados.cvv, nome: 'CVV' }
            ];
            
            campos.forEach(campo => {
              let preenchido = false;
              
              // Tentar todos os IDs possíveis
              for (const id of campo.ids) {
                const elemento = document.getElementById(id);
                if (elemento && (elemento instanceof HTMLInputElement)) {
                  if (utils.setReactInput(elemento, campo.valor)) {
                    console.log(`✅ ${campo.nome}: ${campo.valor}`);
                    preenchido = true;
                    break;
                  }
                }
              }
              
              // Se não encontrou por ID, tentar por atributos
              if (!preenchido) {
                const seletores = [
                  `input[placeholder*="${campo.nome.toLowerCase()}"]`,
                  `input[name*="${campo.ids[0]}"]`,
                  `input[data-field="${campo.ids[0]}"]`
                ];
                
                for (const seletor of seletores) {
                  const elemento = document.querySelector(seletor);
                  if (elemento && (elemento instanceof HTMLInputElement)) {
                    if (utils.setReactInput(elemento, campo.valor)) {
                      console.log(`✅ ${campo.nome}: ${campo.valor}`);
                      preenchido = true;
                      break;
                    }
                  }
                }
              }
              
              if (!preenchido) {
                console.warn(`⚠️ Campo do cartão não encontrado: ${campo.nome}`);
              }
            });
            
            console.log("✅ Dados do cartão preenchidos!");
          }, 1000);
        },

        pix: () => {
          utils.clicar('input[value="pix"]');
          console.log("✅ PIX selecionado!");
        },

        help: () => {
          const pagina = utils.detectarPagina();
          console.log(`
SISTEMA DE TESTES AUTOMATICOS - PASSA BOLA
==========================================

PAGINA ATUAL: ${pagina.toUpperCase()}

COMANDOS DISPONIVEIS:
test.auto()                 - Detecao automatica e preenchimento
test.cadastroIndividual()   - Cadastro individual
test.cadastroEquipeCompleto() - Cadastro completo de equipe
test.contato()             - Formulario de contato
test.checkout()            - Dados de checkout
test.doacao()              - Formulario de doacao
test.voluntaria()          - Cadastro voluntaria
test.loja()                - Adicionar produtos ao carrinho
test.cartao()              - Preencher dados do cartao
test.pix()                 - Selecionar PIX
test.continuar()           - Clicar em continuar
test.termos()              - Aceitar termos
test.finalizar()           - Finalizar formulario

EXEMPLO DE USO:
1. Navegue para qualquer pagina
2. Digite: test.auto()
3. Aguarde o preenchimento automatico

COMANDO PRINCIPAL: test.auto()
          `);
        }
      };

      // Atalhos
      (window as any).test = (window as any).PassaBolaTest;
      (window as any).uni = (window as any).PassaBolaTest;

      console.log("SISTEMA UNIVERSAL ATIVADO");
      console.log("Digite 'test.help()' para ver os comandos");
      console.log("COMANDO RAPIDO: test.auto()");
    // } // Temporariamente removido
  }, []);
};

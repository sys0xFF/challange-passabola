// Hook universal de desenvolvimento para todas as páginas
import { useEffect } from 'react'

export const useDevAutoFill = () => {
  useEffect(() => {
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // Temporariamente removido: if (process.env.NODE_ENV === 'development') {
      console.log('DevAutoFill carregado');
      // Dados universais
      const dadosUniversais = {
        // Dados para cadastro
        cadastro: {
          individual: {
            nomeCompleto: "Maria Silva dos Santos",
            email: "maria.silva@email.com",
            telefone: "(11) 99999-8888",
            idade: "25",
            cidadeBairro: "São Paulo - Vila Madalena",
            posicao: "meia",
            jaParticipou: "sim"
          },
          equipe: {
            nomeTime: "Meninas do Futebol FC",
            nomeCapitao: "Ana Paula Oliveira",
            capitao: {
              nomeCompleto: "Ana Paula Oliveira Santos",
              email: "ana.paula@email.com",
              telefone: "(11) 98765-4321",
              idade: "28",
              cidadeBairro: "São Paulo - Pinheiros",
              posicao: "zagueira",
              jaParticipou: "sim"
            },
            jogadoras: [
              { nomeCompleto: "Fernanda Costa Lima", email: "fernanda@email.com", telefone: "(11) 97777-1111", idade: "22", cidadeBairro: "São Paulo - Vila Olímpia", posicao: "goleira", jaParticipou: "nao" },
              { nomeCompleto: "Juliana Santos Pereira", email: "juliana@email.com", telefone: "(11) 96666-2222", idade: "24", cidadeBairro: "São Paulo - Moema", posicao: "lateral", jaParticipou: "sim" },
              { nomeCompleto: "Carolina Rodrigues Silva", email: "carolina@email.com", telefone: "(11) 95555-3333", idade: "26", cidadeBairro: "São Paulo - Jardins", posicao: "volante", jaParticipou: "sim" },
              { nomeCompleto: "Beatriz Almeida Santos", email: "beatriz@email.com", telefone: "(11) 94444-4444", idade: "23", cidadeBairro: "São Paulo - Itaim Bibi", posicao: "meia", jaParticipou: "nao" },
              { nomeCompleto: "Gabriela Ferreira Lima", email: "gabriela@email.com", telefone: "(11) 93333-5555", idade: "27", cidadeBairro: "São Paulo - Bela Vista", posicao: "atacante", jaParticipou: "sim" },
              { nomeCompleto: "Larissa Martins Costa", email: "larissa@email.com", telefone: "(11) 92222-6666", idade: "21", cidadeBairro: "São Paulo - Centro", posicao: "atacante", jaParticipou: "nao" },
              { nomeCompleto: "Isabela Souza Oliveira", email: "isabela@email.com", telefone: "(11) 91111-7777", idade: "25", cidadeBairro: "São Paulo - Perdizes", posicao: "zagueira", jaParticipou: "sim" }
            ]
          }
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
              console.log("- test.cadastroEquipeCompleto() (para cadastro de equipe)");
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
          console.log("Iniciando cadastro de equipe completo...");
          
          // Primeiro selecionar TIME
          utils.clicar('button:contains("TIME")');
          await utils.aguardar(1000);
          
          const dados = dadosUniversais.cadastro.equipe;
          
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
              
              // ETAPA 3: Dados das 7 jogadoras
              setTimeout(() => {
                console.log("ETAPA 3: Preenchendo dados das 7 jogadoras...");
                
                const jogadoraCards = Array.from(document.querySelectorAll('.border.rounded-lg.p-6'))
                  .filter(card => card.textContent?.includes('Jogadora'));
                
                dados.jogadoras.forEach((jogadora, index) => {
                  setTimeout(() => {
                    if (index < jogadoraCards.length) {
                      const card = jogadoraCards[index];
                      
                      // Buscar inputs por tipo específico
                      const inputNome = card.querySelector('input[placeholder*="nome" i], input[name*="nome" i]');
                      const inputIdade = card.querySelector('input[placeholder*="idade" i], input[name*="idade" i]');
                      const inputEmail = card.querySelector('input[type="email"], input[placeholder*="email" i]');
                      // Buscar telefone pelo placeholder específico do projeto
                      const inputTelefone = card.querySelector('input[placeholder="(11) 99999-9999"]') ||
                                          card.querySelector('input[placeholder*="9999" i]') ||
                                          Array.from(card.querySelectorAll('input')).find(input => {
                                            const placeholder = input.getAttribute('placeholder') || '';
                                            return placeholder.includes('99999') || placeholder.toLowerCase().includes('whatsapp');
                                          });
                      const inputCidade = card.querySelector('input[placeholder*="cidade" i], input[placeholder*="bairro" i]');
                      
                      // Preencher cada campo específico
                      if (inputNome && inputNome instanceof HTMLInputElement) {
                        utils.setReactInput(inputNome, jogadora.nomeCompleto);
                      }
                      if (inputIdade && inputIdade instanceof HTMLInputElement) {
                        utils.setReactInput(inputIdade, jogadora.idade);
                      }
                      if (inputEmail && inputEmail instanceof HTMLInputElement) {
                        utils.setReactInput(inputEmail, jogadora.email);
                      }
                      if (inputTelefone && inputTelefone instanceof HTMLInputElement) {
                        utils.setReactInput(inputTelefone, jogadora.telefone);
                        console.log(`Telefone preenchido para jogadora ${index + 1}: ${jogadora.telefone}`);
                      } else {
                        console.log(`ERRO: Campo telefone nao encontrado para jogadora ${index + 1}`);
                        // Debug: mostrar todos os inputs encontrados
                        const todosInputs = card.querySelectorAll('input');
                        console.log(`Total de inputs encontrados: ${todosInputs.length}`);
                        todosInputs.forEach((input, i) => {
                          console.log(`Input ${i}: placeholder="${input.getAttribute('placeholder')}", type="${input.getAttribute('type')}"`);
                        });
                      }
                      if (inputCidade && inputCidade instanceof HTMLInputElement) {
                        utils.setReactInput(inputCidade, jogadora.cidadeBairro);
                      }
                      
                      // Posição da jogadora (Select)
                      setTimeout(() => {
                        const selectButton = card.querySelector('button[role="combobox"]') ||
                                           card.querySelector('[data-placeholder*="posição"]') ||
                                           Array.from(card.querySelectorAll('button')).find(btn => 
                                             btn.textContent?.includes('Selecione a posição')
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
                            }
                          }, 200);
                        }
                      }, 300);
                      
                      // Radio button "Já participou" da jogadora
                      setTimeout(() => {
                        console.log(`Buscando radio buttons para jogadora ${index + 1}...`);
                        
                        // Buscar pelos IDs específicos do projeto: player-X-sim e player-X-nao
                        const jogadoraId = index + 1; // Baseado na estrutura do JSX
                        const radioSim = document.getElementById(`player-${jogadoraId}-sim`);
                        const radioNao = document.getElementById(`player-${jogadoraId}-nao`);
                        
                        console.log(`Radio SIM encontrado: ${radioSim ? 'sim' : 'nao'}`);
                        console.log(`Radio NAO encontrado: ${radioNao ? 'sim' : 'nao'}`);
                        
                        const valorDesejado = jogadora.jaParticipou;
                        let radioMarcado = false;
                        
                        if (valorDesejado === 'sim' && radioSim) {
                          radioSim.click();
                          radioMarcado = true;
                          console.log(`Radio SIM marcado para jogadora ${index + 1}`);
                        } else if (valorDesejado === 'nao' && radioNao) {
                          radioNao.click();
                          radioMarcado = true;
                          console.log(`Radio NAO marcado para jogadora ${index + 1}`);
                        }
                        
                        if (!radioMarcado) {
                          console.log(`AVISO: Nenhum radio button foi marcado para jogadora ${index + 1}`);
                          console.log(`Valor desejado: ${valorDesejado}`);
                          
                          // Fallback: buscar radio buttons dentro do card
                          const radiosNoCard = card.querySelectorAll('input[type="radio"]');
                          console.log(`Radios encontrados no card: ${radiosNoCard.length}`);
                          radiosNoCard.forEach((radio, radioIndex) => {
                            if (radio instanceof HTMLInputElement) {
                              console.log(`Radio ${radioIndex}: id="${radio.id}", value="${radio.value}"`);
                            }
                          });
                        }
                      }, 700);
                    }
                  }, index * 800);
                });
                
                console.log("Cadastro de equipe completo finalizado!");
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

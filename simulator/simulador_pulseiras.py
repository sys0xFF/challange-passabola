"""
Simulador de Pulseiras IoT com MPU6050
Simula múltiplas pulseiras enviando dados de acelerômetro via MQTT
"""

import paho.mqtt.client as mqtt
import time
import random
import math
import threading
from datetime import datetime

class PulseiraSimulada:
    def __init__(self, band_id, broker="156.67.25.64", port=1883):
        self.band_id = band_id
        self.band_name = f"band{band_id:03d}"
        
        # Configurações MQTT
        self.broker = broker
        self.port = port
        self.topic_subscribe = f"/TEF/{self.band_name}/cmd"
        self.topic_publish_state = f"/TEF/{self.band_name}/attrs"
        self.topic_publish_scoreX = f"/TEF/{self.band_name}/attrs/scoreX"
        self.topic_publish_scoreY = f"/TEF/{self.band_name}/attrs/scoreY"
        self.topic_publish_scoreZ = f"/TEF/{self.band_name}/attrs/scoreZ"
        self.client_id = f"fiware_{self.band_name}_simulator"
        
        # Estado
        self.em_evento = False
        self.score_x = 0.0
        self.score_y = 0.0
        self.score_z = 0.0
        self.last_time = time.time()
        
        # Cliente MQTT
        self.client = mqtt.Client(client_id=self.client_id)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_publish = self.on_publish
        self.client.on_disconnect = self.on_disconnect
        self.client.on_subscribe = self.on_subscribe
        self.connected = False
        
        # Contador de mensagens publicadas
        self.publish_count = 0
        
        # Thread de execução
        self.running = False
        self.thread = None

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print(f"[{self.band_name}] Conectado ao broker MQTT")
            print(f"  Broker: {self.broker}:{self.port}")
            print(f"  Client ID: {self.client_id}")
            self.connected = True
            self.client.subscribe(self.topic_subscribe)
            # Publica estado inicial
            result = self.client.publish(self.topic_publish_state, "s|off")
            print(f"[{self.band_name}] Estado inicial publicado: s|off")
        else:
            error_messages = {
                1: "Versão do protocolo incorreta",
                2: "Identificador de cliente inválido",
                3: "Servidor indisponível",
                4: "Nome de usuário ou senha incorretos",
                5: "Não autorizado"
            }
            error_msg = error_messages.get(rc, f"Erro desconhecido ({rc})")
            print(f"[{self.band_name}] ERRO na conexão: {error_msg}")

    def on_publish(self, client, userdata, mid):
        """Callback chamado quando uma mensagem é publicada com sucesso"""
        self.publish_count += 1
        # Removido log para não poluir
    
    def on_disconnect(self, client, userdata, rc):
        """Callback chamado quando desconecta"""
        if rc != 0:
            print(f"[{self.band_name}] Desconexão inesperada! Código: {rc}")
        else:
            print(f"[{self.band_name}] Desconectado")
        self.connected = False
    
    def on_subscribe(self, client, userdata, mid, granted_qos):
        """Callback chamado quando se inscreve em um tópico"""
        print(f"[{self.band_name}] Inscrito em: {self.topic_subscribe}")

    def on_message(self, client, userdata, msg):
        mensagem = msg.payload.decode('utf-8')
        print(f"\n📨 [{self.band_name}] Mensagem recebida!")
        print(f"   └─ Tópico: {msg.topic}")
        print(f"   └─ Payload: {mensagem}")
        print(f"   └─ QoS: {msg.qos}")
        
        on_topic = f"{self.band_name}@on|"
        off_topic = f"{self.band_name}@off|"
        
        if mensagem == on_topic:
            print(f"🟢 [{self.band_name}] EVENTO INICIADO")
            self.em_evento = True
            self.last_time = time.time()
            
            # ZERA os scores quando inicia (igual pulseira real)
            self.score_x = 0.0
            self.score_y = 0.0
            self.score_z = 0.0
            print(f"   └─ Scores resetados para começar limpo")
            
        elif mensagem == off_topic:
            print(f"� [{self.band_name}] EVENTO FINALIZADO")
            print(f"   └─ Scores finais antes do reset: X={self.score_x:.2f}, Y={self.score_y:.2f}, Z={self.score_z:.2f}")
            
            # ZERA os scores quando termina (igual pulseira real)
            self.score_x = 0.0
            self.score_y = 0.0
            self.score_z = 0.0
            
            self.em_evento = False
            print(f"   └─ Scores resetados após evento (comportamento da pulseira real)")

    def simular_e_publicar_movimento(self):
        """Simula movimento e publica scores em tempo real (igual pulseira real com MPU6050)"""
        if not self.connected or not self.em_evento:
            return
        
        # Simula leitura do acelerômetro com valores MAIORES para mais score
        # Valores entre -5 e 5 (mais intenso que antes)
        ax_g = random.uniform(-5, 5)
        ay_g = random.uniform(-5, 5)
        az_g = random.uniform(-5, 5)
        
        # Aplica threshold de ruído (igual pulseira real)
        if abs(ax_g) < 1:
            ax_g = 0
        if abs(ay_g) < 1:
            ay_g = 0
        if abs(az_g) < 1:
            az_g = 0
        
        # Simula giroscópio (para detectar parada)
        # Reduzido a chance de parar (60% de chance de estar em movimento)
        gx_dps = random.uniform(-100, 100)
        gy_dps = random.uniform(-100, 100)
        gz_dps = random.uniform(-100, 100)
        
        # Se todos os giros < 10, considera parado (igual pulseira real)
        if abs(gx_dps) < 10 and abs(gy_dps) < 10 and abs(gz_dps) < 10:
            # Parado - não atualiza scores
            return
        
        # Calcula dt (tempo desde última leitura)
        now = time.time()
        dt = now - self.last_time
        self.last_time = now
        
        # Score acumula |aceleração| * dt (igual pulseira real)
        self.score_x += abs(ax_g) * dt
        self.score_y += abs(ay_g) * dt
        self.score_z += abs(az_g) * dt
        
        # Publica os valores acumulados
        if self.connected:
            self.client.publish(self.topic_publish_scoreX, f"{self.score_x:.2f}")
            self.client.publish(self.topic_publish_scoreY, f"{self.score_y:.2f}")
            self.client.publish(self.topic_publish_scoreZ, f"{self.score_z:.2f}")
        
        # Log reduzido - apenas a cada 50 pontos
        if int(self.score_x) % 50 < 2:
            print(f"[{self.band_name}] X: {self.score_x:.2f} | Y: {self.score_y:.2f} | Z: {self.score_z:.2f}")

    def enviar_estado(self):
        """Envia estado atual da pulseira"""
        if not self.connected:
            return
        
        estado = "s|on" if self.em_evento else "s|off"
        self.client.publish(self.topic_publish_state, estado)

    def conectar(self):
        """Conecta ao broker MQTT"""
        try:
            print(f"[{self.band_name}] Conectando ao broker {self.broker}:{self.port}...")
            
            self.client.connect(self.broker, self.port, keepalive=60)
            self.client.loop_start()
            
            # Aguarda confirmação
            time.sleep(2)
            
            if self.connected:
                print(f"[{self.band_name}] Conexão estabelecida\n")
                return True
            else:
                print(f"[{self.band_name}] Aguardando confirmação...\n")
                return True
                
        except Exception as e:
            print(f"[{self.band_name}] ERRO ao conectar: {e}")
            print(f"  Verifique se o broker está rodando em {self.broker}:{self.port}\n")
            return False

    def desconectar(self):
        """Desconecta do broker MQTT"""
        self.running = False
        if self.thread:
            self.thread.join(timeout=2)
        self.client.loop_stop()
        self.client.disconnect()
        print(f"[{self.band_name}] Desconectado")

    def loop(self):
        """Loop principal da pulseira (simula o loop() do ESP32)"""
        self.running = True
        contador_estado = 0
        
        while self.running:
            try:
                # Se está em evento, simula leituras do sensor
                if self.em_evento:
                    # REDUZIDO: Publica a cada 0.5 segundos (antes era 0.1s = 10x/s)
                    # Isso reduz em 80% o número de requests
                    time.sleep(0.5)
                    self.simular_e_publicar_movimento()
                else:
                    time.sleep(1.0)  # Mais lento quando não está em evento
                
                # Envia estado MENOS frequentemente
                contador_estado += 1
                intervalo = 20 if self.em_evento else 10  # ~10 segundos durante evento
                if contador_estado >= intervalo:
                    self.enviar_estado()
                    contador_estado = 0
                    
            except KeyboardInterrupt:
                break
            except Exception as e:
                print(f"[{self.band_name}] ERRO no loop: {e}")
                time.sleep(1)

    def iniciar(self):
        """Inicia a simulação em uma thread separada"""
        if not self.conectar():
            return False
        
        self.thread = threading.Thread(target=self.loop, daemon=True)
        self.thread.start()
        return True


def main():
    print("=" * 60)
    print("SIMULADOR DE PULSEIRAS IoT - NEXT 2025")
    print("=" * 60)
    print()
    
    # Pergunta se quer modo debug
    debug_mode = input("Ativar modo DEBUG com logs detalhados? (s/N): ").lower() == 's'
    if debug_mode:
        import logging
        logging.basicConfig(level=logging.DEBUG)
        print("Modo DEBUG ativado\n")
    
    # Pergunta quantas pulseiras simular
    while True:
        try:
            num_pulseiras = int(input("Quantas pulseiras deseja simular? (1-20): "))
            if 1 <= num_pulseiras <= 20:
                break
            else:
                print("Por favor, escolha um número entre 1 e 20.")
        except ValueError:
            print("Por favor, digite um número válido.")
    
    print()
    
    # Pergunta o ID inicial
    while True:
        try:
            id_inicial = int(input(f"ID inicial da primeira pulseira? (ex: 10 para band010): "))
            if 1 <= id_inicial <= 999:
                break
            else:
                print("Por favor, escolha um número entre 1 e 999.")
        except ValueError:
            print("Por favor, digite um número válido.")
    
    print()
    print("-" * 60)
    
    # Cria e inicia as pulseiras
    pulseiras = []
    for i in range(num_pulseiras):
        band_id = id_inicial + (i * 10)
        pulseira = PulseiraSimulada(band_id)
        
        # Ativa logger se modo debug
        if debug_mode:
            pulseira.client.enable_logger()
        
        if pulseira.iniciar():
            pulseiras.append(pulseira)
            time.sleep(1)  # Delay entre conexões
        else:
            print(f"Falha ao iniciar pulseira {band_id}")
    
    print()
    print("-" * 60)
    print(f"{len(pulseiras)} pulseira(s) conectada(s)")
    print()
    print("Configurações:")
    print("  - Publicação de scores: a cada 0.5s durante evento")
    print("  - Publicação de estado: a cada 10s")
    print("  - Aceleração máxima: 5g (scores mais altos)")
    print("  - Pressione Ctrl+C para encerrar")
    print("-" * 60)
    print()
    
    # Mantém o programa rodando
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\nEncerrando simulador...")
        for pulseira in pulseiras:
            pulseira.desconectar()
        print("Simulador encerrado!")


if __name__ == "__main__":
    main()

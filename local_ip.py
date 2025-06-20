import requests
import json
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def get_public_ip():
    """
    尝试从多个公共 IP 地址服务获取当前的公共 IP 地址。
    """
    # 优先使用的 IP 获取服务列表，按顺序尝试
    ip_services = [
        {'url': 'https://icanhazip.com/', 'key': None},
        {'url': 'https://api.ipify.org?format=json', 'key': 'ip'},
        {'url': 'https://httpbin.org/ip', 'key': 'origin'}
    ]

    for service in ip_services:
        try:
            url = service['url']
            key = service['key']
            logging.info(f"尝试从 {url} 获取公共 IP 地址...")
            response = requests.get(url, timeout=10) # 增加超时时间
            response.raise_for_status()  # 如果请求失败，抛出 HTTPError

            if key:
                # 处理 JSON 响应
                ip_data = response.json()
                public_ip = ip_data.get(key)
            else:
                # 处理纯文本响应
                public_ip = response.text.strip()

            if public_ip:
                logging.info(f"成功从 {url} 获取到公共 IP 地址: {public_ip}")
                return public_ip
            else:
                logging.warning(f"未能从 {url} 的 API 响应中获取到 IP 地址。")
        except requests.exceptions.Timeout:
            logging.error(f"从 {url} 获取 IP 地址时请求超时。")
        except requests.exceptions.ConnectionError as e:
            logging.error(f"从 {url} 获取 IP 地址时发生连接错误: {e}")
        except requests.exceptions.RequestException as e:
            logging.error(f"从 {url} 获取 IP 地址时发生未知请求错误: {e}")
        except json.JSONDecodeError:
            logging.error(f"从 {url} 解析 JSON 响应失败。")

    logging.error("未能从任何配置的服务获取到 IP 地址。")
    return None

def send_bark_notification(ip_address, bark_url_base):
    """
    使用 Bark (Day.app) 服务发送包含 IP 地址的通知。
    """
    if not ip_address:
        logging.warning("没有 IP 地址，无法发送通知。")
        return

    # 构造完整的 Bark 通知 URL
    # URL 结构为：https://api.day.app/你的密钥/你的标题/你的内容
    # 在这里，我们将 IP 地址作为内容发送
    full_bark_url = f"{bark_url_base}{ip_address}"

    try:
        logging.info(f"正在发送 Bark 通知到: {full_bark_url}")
        response = requests.get(full_bark_url, timeout=10) # 增加超时时间
        response.raise_for_status()  # 如果请求失败，抛出 HTTPError
        logging.info(f"Bark 通知发送成功！响应: {response.text}")
    except requests.exceptions.Timeout:
        logging.error(f"发送 Bark 通知到 {full_bark_url} 时请求超时。")
    except requests.exceptions.ConnectionError as e:
        logging.error(f"发送 Bark 通知到 {full_bark_url} 时发生连接错误: {e}")
    except requests.exceptions.RequestException as e:
        logging.error(f"发送 Bark 通知到 {full_bark_url} 时发生未知请求错误: {e}")

if __name__ == "__main__":
    # 您的 Bark 应用的 URL 前缀
    # 请注意，您的 URL 已经包含了密钥部分，所以我们直接使用它
    BARK_URL_BASE = "https://api.day.app/xxxxxxxxxx/"

    # 获取公共 IP 地址
    current_ip = get_public_ip()

    # 如果成功获取到 IP 地址，则发送 Bark 通知
    if current_ip:
        send_bark_notification(current_ip, BARK_URL_BASE)
    else:
        logging.error("未能获取 IP 地址，通知未发送。")

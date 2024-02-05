from concurrent.futures import ThreadPoolExecutor, as_completed

        
def concurrent_api_with_timeout(timeout=120):
    def decorator(func):
        def wrapper(*args, **kwargs):
            with ThreadPoolExecutor() as executor:
                futures = [executor.submit(func, arg, timeout=timeout) for arg in args[0]]
                for f in as_completed(futures):
                    yield f.result()
        return wrapper
    return decorator
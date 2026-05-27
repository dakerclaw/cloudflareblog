// ==================== 缓存模块（Workers Cache API）====================

const DEFAULT_TTL = 300; // 5分钟默认缓存

/**
 * 获取缓存的响应
 */
export async function getCachedResponse(request) {
  const cache = caches.default;
  const cacheKey = new Request(request.url, { method: 'GET' });
  return cache.match(cacheKey);
}

/**
 * 缓存响应
 */
export async function cacheResponse(request, response, ttl = DEFAULT_TTL) {
  const cache = caches.default;
  const cacheKey = new Request(request.url, { method: 'GET' });
  const cloned = response.clone();
  cloned.headers.set('Cache-Control', `public, max-age=${ttl}`);
  await cache.put(cacheKey, cloned);
}

/**
 * 清除匹配模式的缓存
 */
export async function purgeCache(pattern) {
  // Workers Cache API 不支持批量删除按模式匹配
  // 这里只是标记，实际清除需要通过 cache.delete
  console.log(`[Cache] Purge requested for pattern: ${pattern}`);
}

/**
 * 带缓存的响应包装器
 */
export async function withCache(request, fetchFn, ttl = DEFAULT_TTL) {
  // 只缓存 GET 请求
  if (request.method !== 'GET') {
    return fetchFn();
  }

  // 尝试从缓存获取
  const cached = await getCachedResponse(request);
  if (cached) {
    return cached;
  }

  // 执行实际请求
  const response = await fetchFn();

  // 只缓存成功响应
  if (response.ok) {
    await cacheResponse(request, response, ttl);
  }

  return response;
}

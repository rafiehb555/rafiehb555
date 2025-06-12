import { api } from '@/lib/api';

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.href = 'http://localhost';
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not add auth token if not present', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const response = await api.get('/test');
    expect(response).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('/api/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should add auth token if present', async () => {
    localStorage.setItem('token', 'test-token');
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const response = await api.get('/test');
    expect(response).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('/api/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
    });
  });

  it('should handle 401 response', async () => {
    localStorage.setItem('token', 'test-token');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    await expect(api.get('/test')).rejects.toThrow();
    expect(localStorage.getItem('token')).toBeNull();
    expect(window.location.href).toBe('http://localhost/login');
  });

  it('should make GET requests', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const response = await api.get('/test');
    expect(response).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('/api/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should make POST requests', async () => {
    const mockData = { test: 'data' };
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const response = await api.post('/test', mockData);
    expect(response).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockData),
    });
  });

  it('should handle errors', async () => {
    const mockError = new Error('Test error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(api.get('/test')).rejects.toThrow('Test error');
  });
});

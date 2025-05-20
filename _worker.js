export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    env.NODEJS_COMPAT = '1';
    return env.ASSETS.fetch(request);
  }
};

import createFastify from "fastify";
import type { PoolClient } from "pg";
import { Pool } from "pg";
import { uuidv7 } from "uuidv7";
import { z } from "zod";
import { env } from "~/src/env";

const pgPool = new Pool();

const fastifyApp = createFastify({
  logger: true,
});

type QueryParam = Array<QueryParam> | boolean | number | string | null;
const queryParamSchema: z.ZodType<QueryParam> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.lazy(() => z.array(queryParamSchema)),
]);
const conns: Record<string, PoolClient | undefined> = {};

const querySchema = z.object({
  text: z.string(),
  values: z
    .optional(z.union([z.array(queryParamSchema), z.null()]))
    .transform((values) => values ?? undefined),
});

fastifyApp.post("/query", async (request, reply) => {
  if (request.headers.authorization !== `Bearer ${env().API_KEY}`) {
    return await reply.code(401);
  }

  const query = querySchema.parse(request.body);
  request.log.info({
    query,
  });

  try {
    const result = await pgPool.query(query);

    return await reply.code(200).send({
      result,
    });
  } catch (exception) {
    return await reply.code(400).send({
      exception,
    });
  }
});

fastifyApp.post("/connection/use", async (request, reply) => {
  if (request.headers.authorization !== `Bearer ${env().API_KEY}`) {
    return await reply.code(401);
  }

  const conn = await pgPool.connect();
  const connId = uuidv7();
  conns[connId] = conn;

  request.log.info({
    connId,
  });

  return await reply.code(201).send({
    connection_id: connId,
  });
});

fastifyApp.post("/connection/query/:connection_id", async (request, reply) => {
  if (request.headers.authorization !== `Bearer ${env().API_KEY}`) {
    return await reply.code(401);
  }

  const connId = z
    .object({ connection_id: z.string() })
    .parse(request.params).connection_id;

  request.log.info({
    connId,
  });

  const conn = conns[connId];
  if (conn === undefined) {
    return await reply.code(410);
  }

  const query = querySchema.parse(request.body);
  request.log.info({
    connId,
    query,
  });

  try {
    const result = await conn.query(query);

    return await reply.code(200).send({
      result,
    });
  } catch (exception) {
    return await reply.code(400).send({
      exception,
    });
  }
});

fastifyApp.post(
  "/connection/release/:connection_id",
  async (request, reply) => {
    if (request.headers.authorization !== `Bearer ${env().API_KEY}`) {
      return await reply.code(401);
    }

    const connId = z
      .object({ connection_id: z.string() })
      .parse(request.params).connection_id;

    request.log.info({
      connId,
    });

    const conn = conns[connId];
    if (conn === undefined) {
      return await reply.code(410);
    }

    conn.release();
    conns[connId] = undefined;

    return await reply.code(202);
  }
);

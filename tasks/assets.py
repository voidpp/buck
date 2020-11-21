from invoke import Context


class Frontend:

    @staticmethod
    def transpile(context: Context, watch: bool):
        command = ['npx', 'webpack']

        if watch:
            command.append('--watch')

        command.append('--output-path ./buck/static')

        context.run(' '.join(command))

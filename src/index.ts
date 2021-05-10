import { Command, flags } from "@oclif/command";
import { takeOrders } from "./clerk";
import { assertFullyQualifiedPath } from "./fileReader";

class TakePaintOrders extends Command {
  static description =
    "Creates the ideal set of paints given the input file (which constains customer requests)";

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    path: flags.string({
      char: "p",
      description: "path of file that contains customers orders",
      required: true,
    }),
  };

  static args = [];

  async run() {
    const { flags } = this.parse(TakePaintOrders);

    const fileAsString = assertFullyQualifiedPath(flags.path);

    const result = takeOrders(fileAsString);

    this.log(result);
  }
}

export = TakePaintOrders;
